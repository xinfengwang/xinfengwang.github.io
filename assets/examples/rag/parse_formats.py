"""Normalize controlled HTML, DOCX and PDF snapshots into traceable text blocks."""
from argparse import ArgumentParser
from hashlib import sha256
from io import BytesIO
from pathlib import Path
import json
import os
import sys

import pymupdf as pdf
from docx import Document as WordDocument
from docx.table import Table

from rag_lab import ROOT, PolicyHTML, load_data, normalize


def table_rows(grid):
    if not grid or len(grid) < 2:
        raise ValueError("table needs a header and at least one data row")
    headers = [normalize(cell or "") for cell in grid[0]]
    if any(not header for header in headers) or len(set(headers)) != len(headers):
        raise ValueError("table needs one unique, nonempty header per column")
    for row_number, row in enumerate(grid[1:], 2):
        if len(row) != len(headers):
            raise ValueError(f"row {row_number} has a different width from the header")
        values = [normalize(cell or "") for cell in row]
        if any(values):
            yield row_number, " | ".join(
                f"{key}: {value}" for key, value in zip(headers, values, strict=True)
            )


def html_blocks(source):
    parser = PolicyHTML()
    parser.feed(source)
    parser.close()
    blocks = [(kind, text, {"line": line}) for kind, line, text in parser.blocks]
    assets = [dict(image, kind="image") for image in parser.images]
    return blocks, assets, {}, []


def docx_blocks(source):
    document = WordDocument(BytesIO(source))
    blocks, assets, issues = [], [], []
    for item_number, item in enumerate(document.iter_inner_content(), 1):
        location = {"body_block": item_number}
        drawings = item._element.xpath(".//w:drawing")
        for index, drawing in enumerate(drawings, 1):
            properties = drawing.xpath(".//wp:docPr")
            alt = properties[0].get("descr", "") if properties else ""
            assets.append({"kind": "image", **location, "drawing": index, "alt": normalize(alt)})
        if isinstance(item, Table):
            rows = list(item.rows)
            cell_nodes = [cell._tc for row in rows for cell in row.cells]
            irregular = any(row.grid_cols_before or row.grid_cols_after for row in rows)
            nested = any(cell.tables for row in rows for cell in row.cells)
            if not rows or irregular or nested or len(set(cell_nodes)) != len(cell_nodes):
                issues.append(f"Word body block {item_number}: irregular, merged or nested table")
                continue
            try:
                grid = [[cell.text for cell in row.cells] for row in rows]
                rows_with_headers = list(table_rows(grid))
                blocks.extend(("table_row", text, {**location, "row": row}) for row, text in rows_with_headers)
            except ValueError as error:
                issues.append(f"Word body block {item_number}: {error}")
        else:
            style = item.style.name if item.style else ""
            kind = "title" if style == "Title" else "heading" if style.startswith("Heading ") else "paragraph"
            blocks.append((kind, item.text, {**location, "style": style}))
    properties = document.core_properties
    metadata = {name: getattr(properties, name) for name in ("title", "author", "subject")}
    return blocks, assets, metadata, issues


def reading_order(items, column_split):
    ordered = sorted(items, key=lambda item: (item[0].y0, item[0].x0))
    if column_split is None:
        return ordered
    # Full-width items separate the page into bands. Within a band, read left then right.
    result, band = [], []
    for item in ordered:
        box = item[0]
        if box.x0 < column_split < box.x1:
            result.extend(sorted(band, key=lambda entry: (entry[0].x0 >= column_split, entry[0].y0)))
            band.clear()
            result.append(item)
        else:
            band.append(item)
    result.extend(sorted(band, key=lambda entry: (entry[0].x0 >= column_split, entry[0].y0)))
    return result


def pdf_blocks(source, column_split, ocr_language, ocr_pages, tessdata):
    blocks, assets, issues = [], [], []
    with pdf.open(stream=source, filetype="pdf") as document:
        metadata = {key: document.metadata.get(key, "") for key in ("title", "author", "subject")}
        if any(not 1 <= number <= len(document) for number in ocr_pages):
            raise ValueError("OCR page numbers must be within the PDF")
        for page in document:
            page_number = page.number + 1
            if column_split is not None and not page.rect.x0 < column_split < page.rect.x1:
                raise ValueError(f"column split falls outside page {page_number}")
            images = page.get_image_info()
            assets.extend({"kind": "image", "page": page_number, "bbox": image["bbox"]} for image in images)
            native_text = normalize(page.get_text())
            needs_ocr = (not native_text and bool(images)) or page_number in ocr_pages
            textpage = None
            if needs_ocr:
                if not ocr_language:
                    issues.append(f"PDF page {page_number}: OCR required")
                    continue
                textpage = page.get_textpage_ocr(language=ocr_language, dpi=300, full=True, tessdata=tessdata)
            elif images:
                issues.append(f"PDF page {page_number}: images need caption or region review")

            items, table_boxes = [], []
            # Geometry-based grid extraction is meaningful on native PDF pages.
            if textpage is None:
                for table in page.find_tables().tables:
                    try:
                        rows = list(table_rows(table.extract()))
                        items.extend((pdf.Rect(table.rows[row - 1].bbox), "table_row", text, {"row": row})
                                     for row, text in rows)
                        table_boxes.append(pdf.Rect(table.bbox))
                    except ValueError as error:
                        issues.append(f"PDF page {page_number}: {error}")
            contents = page.get_text("dict", flags=pdf.TEXTFLAGS_TEXT, textpage=textpage)
            for block in contents["blocks"]:
                if block["type"] != 0:
                    continue
                for line in block["lines"]:
                    box = pdf.Rect(line["bbox"])
                    center = (box.top_left + box.bottom_right) / 2
                    if any(region.contains(center) for region in table_boxes):
                        continue
                    text = "".join(span["text"] for span in line["spans"])
                    items.append((box, "paragraph", text, {}))
            if not items:
                issues.append(f"PDF page {page_number}: no extractable text")
            method = "ocr" if textpage is not None else "native"
            for box, kind, text, extra in reading_order(items, column_split):
                blocks.append((kind, text, {"page": page_number, "bbox": tuple(box), "method": method, **extra}))
    return blocks, assets, metadata, issues


def parse_file(path, column_split=None, ocr_language=None, ocr_pages=(), tessdata=None):
    source = path.read_bytes()
    kind = path.suffix.lower()
    if kind in {".html", ".htm"}:
        rows, assets, metadata, issues = html_blocks(source.decode("utf-8-sig"))
    elif kind == ".docx":
        rows, assets, metadata, issues = docx_blocks(source)
    elif kind == ".pdf":
        rows, assets, metadata, issues = pdf_blocks(source, column_split, ocr_language, ocr_pages, tessdata)
    else:
        raise ValueError(f"unsupported file extension: {kind}")
    blocks, cursor = [], 0
    for block_kind, text, location in rows:
        text = normalize(text)
        if text:
            blocks.append({"kind": block_kind, "text": text, "start": cursor,
                           "end": cursor + len(text), "source": location})
            cursor += len(text) + 1
    if not blocks:
        raise ValueError(f"no searchable text in {path.name}: {', '.join(issues)}")
    text = "\n".join(block["text"] for block in blocks)
    return {"source": path.name, "sha256": sha256(source).hexdigest(), "text": text,
            "metadata": metadata, "blocks": blocks, "assets": assets, "review": issues}


def write_demo(directory):
    directory.mkdir(parents=True, exist_ok=True)
    corpus = json.loads((ROOT / "corpus.json").read_text(encoding="utf-8"))
    source = next(raw for raw in corpus["documents"] if raw["id"] == "codes")
    documents, _ = load_data()
    blocks = documents["codes"].blocks
    (directory / "codes.html").write_text(source["source"], encoding="utf-8")
    row_texts = [block.text for block in blocks if block.kind == "table_row"]
    columns = [[cell.split(": ", 1) for cell in row.split(" | ")] for row in row_texts]
    grid = [[key for key, _ in columns[0]], *[[value for _, value in row] for row in columns]]
    title = source["title"]

    word = WordDocument()
    word.core_properties.title = title
    word.add_heading(title, level=0)
    table = word.add_table(rows=len(grid), cols=len(grid[0]))
    for table_row, values in zip(table.rows, grid, strict=True):
        for cell, value in zip(table_row.cells, values, strict=True):
            cell.text = value
    word.save(directory / "codes.docx")

    with pdf.open() as file, pdf.open() as raster_source:
        page = file.new_page()
        page.insert_text((50, 45), title, fontsize=16)
        page.insert_text((320, 80), "Billing", fontsize=12)
        page.insert_text((50, 95), "Refunds", fontsize=12)
        edges = (50, 125, 285, 550)
        for x in edges:
            page.draw_line((x, 120), (x, 120 + 24 * len(grid)))
        for row_number, values in enumerate(grid):
            y = 120 + row_number * 24
            page.draw_line((edges[0], y), (edges[-1], y))
            for x, value in zip(edges[:-1], values, strict=True):
                page.insert_text((x + 4, y + 16), value, fontsize=10)
        page.draw_line((edges[0], 120 + 24 * len(grid)), (edges[-1], 120 + 24 * len(grid)))

        scan_text = grid[1][-1]
        render = raster_source.new_page(width=480, height=100)
        render.insert_text((32, 54), scan_text, fontsize=20)
        pixmap = render.get_pixmap(dpi=200)
        scan = file.new_page(width=480, height=100)
        scan.insert_image(scan.rect, pixmap=pixmap)
        file.set_metadata({"title": title})
        file.save(directory / "codes.pdf")
    return scan_text


def verify_demo(directory, ocr_language, tessdata):
    scan_text = write_demo(directory)
    _, questions = load_data()
    expected = next(q for q in questions if q["id"] == "refund_201")["evidence"][0]["needle"]
    for extension in ("html", "docx", "pdf"):
        path = directory / f"codes.{extension}"
        parsed = parse_file(path, 300 if extension == "pdf" else None, ocr_language, tessdata=tessdata)
        row = next(block for block in parsed["blocks"] if block["text"] == expected)
        assert row["kind"] == "table_row" and parsed["text"][row["start"]:row["end"]] == expected
        assert "REF-999" not in parsed["text"]
        if extension == "pdf":
            assert parsed["text"].index("Refunds") < parsed["text"].index("Billing")
            assert any(asset["page"] == 2 for asset in parsed["assets"])
            if ocr_language:
                assert any(block["text"] == scan_text and block["source"]["method"] == "ocr"
                           for block in parsed["blocks"])
            else:
                assert "PDF page 2: OCR required" in parsed["review"]
        print(json.dumps({"file": path.name, "evidence_source": row["source"], "review": parsed["review"]}))


def main():
    # The CLI reserves stdout for machine-readable output.
    os.environ["PYMUPDF_SUGGEST_LAYOUT_ANALYZER"] = "0"
    pdf.set_messages(stream=sys.stderr)
    parser = ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    parse = commands.add_parser("parse")
    parse.add_argument("path", type=Path)
    parse.add_argument("--column-split", type=float)
    parse.add_argument("--ocr-page", type=int, action="append", default=[])
    demo = commands.add_parser("demo")
    demo.add_argument("--output-dir", type=Path, required=True)
    for command in (parse, demo):
        command.add_argument("--ocr-language", help="Tesseract language names, e.g. eng or chi_sim+eng")
        command.add_argument("--tessdata", help="directory holding Tesseract traineddata files")
    args = parser.parse_args()
    if args.command == "demo":
        verify_demo(args.output_dir, args.ocr_language, args.tessdata)
    else:
        result = parse_file(args.path, args.column_split, args.ocr_language, args.ocr_page, args.tessdata)
        print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
