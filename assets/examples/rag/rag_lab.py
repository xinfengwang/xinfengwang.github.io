"""A reproducible RAG retrieval lab. Python 3.11+, standard library only."""
from argparse import ArgumentParser
from collections import Counter
from dataclasses import asdict, dataclass
from functools import cache
from html.parser import HTMLParser
from math import log, sqrt
from pathlib import Path
import json
import re


ROOT = Path(__file__).resolve().parent
WORD = re.compile(r"[^\W_]+(?:-[^\W_]+)*", re.UNICODE)
SENTENCE_END = re.compile(r"(?<=[.!?。！？])\s+|(?<=[。！？])(?=\S)")
BOUNDARIES = (re.compile(r"\n+"), SENTENCE_END, re.compile(r"\s+"))
CHUNK_STRATEGIES = ("fixed", "overlap", "recursive", "section", "semantic", "parent_child")


def normalize(text):
    return " ".join(text.split())


@dataclass(frozen=True)
class Block:
    kind: str
    text: str
    source_line: int
    start: int
    end: int


@dataclass(frozen=True)
class Document:
    id: str
    title: str
    revision: int
    region: str
    scope: str
    active: bool
    text: str
    blocks: tuple[Block, ...]


@dataclass(frozen=True)
class Chunk:
    doc: str
    start: int
    end: int
    text: str


class PolicyHTML(HTMLParser):
    """Read a controlled subset of HTML, including single-header tables."""

    ignored = {"nav", "script", "style"}
    content_tags = {"h1": "title", "h2": "heading", "h3": "heading", "p": "paragraph", "li": "paragraph"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []
        self.images = []
        self.hidden = []
        self.block = None
        self.headers = []
        self.row = []
        self.cell = None
        self.line = 1

    def handle_starttag(self, tag, attrs):
        if tag in self.ignored:
            self.hidden.append(tag)
        if self.hidden:
            return
        if tag == "img":
            attributes = dict(attrs)
            self.images.append({
                "line": self.getpos()[0], "uri": attributes.get("src"),
                "alt": normalize(attributes.get("alt") or ""),
            })
        if tag in self.content_tags:
            self.block = (tag, self.getpos()[0], [])
        elif tag == "table":
            self.headers = []
        elif tag == "tr":
            self.row = []
            self.line = self.getpos()[0]
        elif tag in {"td", "th"}:
            if any(name in {"rowspan", "colspan"} and value != "1" for name, value in attrs):
                raise ValueError("merged cells need a layout-aware parser")
            self.cell = (tag, [])

    def handle_endtag(self, tag):
        if self.hidden:
            if tag == self.hidden[-1]:
                self.hidden.pop()
            return
        if self.cell and tag == self.cell[0]:
            self.row.append((tag, normalize("".join(self.cell[1]))))
            self.cell = None
        elif tag == "tr" and self.row:
            values = [text for _, text in self.row]
            if all(kind == "th" for kind, _ in self.row):
                self.headers = values
            else:
                if len(values) != len(self.headers) or any(kind != "td" for kind, _ in self.row):
                    raise ValueError(f"unsupported table at line {self.line}")
                joined = " | ".join(f"{header}: {value}" for header, value in zip(self.headers, values, strict=True))
                self.blocks.append(("table_row", self.line, joined))
        elif self.block and tag == self.block[0]:
            name, line, parts = self.block
            self.blocks.append((self.content_tags[name], line, normalize("".join(parts))))
            self.block = None

    def handle_data(self, text):
        if not self.hidden:
            if self.cell:
                self.cell[1].append(text)
            elif self.block:
                self.block[2].append(text)


def text_blocks(source, markdown):
    parts = []
    line_start = 1
    fenced = False
    for number, line in enumerate(source.splitlines() + [""], 1):
        if markdown and line.strip().startswith("```"):
            if parts:
                yield "paragraph", line_start, normalize(" ".join(parts))
                parts = []
            fenced = not fenced
            continue
        if fenced:
            continue
        heading = re.fullmatch(r"(#{1,6})\s+(.+)", line) if markdown else None
        if not line.strip() or heading:
            if parts:
                yield "paragraph", line_start, normalize(" ".join(parts))
                parts = []
            if heading:
                yield ("title" if heading[1] == "#" else "heading"), number, normalize(heading[2])
        else:
            if not parts:
                line_start = number
            parts.append(line)
    if fenced:
        raise ValueError("unclosed Markdown code fence")


def parse(raw):
    if raw["format"] == "html":
        parser = PolicyHTML()
        parser.feed(raw["source"])
        parser.close()
        source_blocks = parser.blocks
    elif raw["format"] in {"markdown", "text"}:
        source_blocks = text_blocks(raw["source"], markdown=raw["format"] == "markdown")
    else:
        raise ValueError(f"unsupported format: {raw['format']}")

    blocks = []
    cursor = 0
    for kind, line, text in source_blocks:
        if not text:
            continue
        blocks.append(Block(kind, text, line, cursor, cursor + len(text)))
        cursor += len(text) + 1
    if not blocks:
        raise ValueError(f"empty parsed document: {raw['id']}")
    return Document(
        id=raw["id"], title=raw["title"], revision=raw["revision"], region=raw["region"],
        scope=raw["scope"], active=raw["active"], text="\n".join(block.text for block in blocks),
        blocks=tuple(blocks),
    )


def tokens(text):
    return [match.group().casefold() for match in WORD.finditer(text)]


def windows(document, start, end, size, overlap):
    positions = [match.start() + start for match in WORD.finditer(document.text[start:end])]
    if not positions:
        return
    stride = size - overlap
    for index in range(0, len(positions), stride):
        stop = min(index + size, len(positions))
        left = start if index == 0 else positions[index]
        right = end if stop == len(positions) else positions[stop]
        yield Chunk(document.id, left, right, document.text[left:right])
        if stop == len(positions):
            break


def section_spans(document):
    """Keep headings with their section. Treat each table row as an atomic group."""
    groups = []
    current = []
    for block in document.blocks:
        if block.kind in {"heading", "table_row"} and current:
            groups.append(current)
            current = []
        current.append(block)
        if block.kind == "table_row":
            groups.append(current)
            current = []
    if current:
        groups.append(current)

    for group in groups:
        yield group[0].start, group[-1].end


def split_at(text, start, end, boundary):
    cuts = [start]
    cuts.extend(match.end() for match in boundary.finditer(text, start, end) if start < match.end() < end)
    cuts.append(end)
    return list(zip(cuts, cuts[1:]))


def fits(text, start, end, size):
    return len(tokens(text[start:end])) <= size


def pack(document, spans, size):
    """Merge adjacent spans while preserving the original coordinates."""
    start = end = None
    for left, right in spans:
        if start is None:
            start = left
        elif not fits(document.text, start, right, size):
            yield Chunk(document.id, start, end, document.text[start:end])
            start = left
        end = right
    if start is not None and tokens(document.text[start:end]):
        yield Chunk(document.id, start, end, document.text[start:end])


def recursive_spans(document, start, end, size, separators=BOUNDARIES):
    if fits(document.text, start, end, size):
        yield start, end
    elif separators:
        for left, right in split_at(document.text, start, end, separators[0]):
            yield from recursive_spans(document, left, right, size, separators[1:])
    else:
        for chunk in windows(document, start, end, size, 0):
            yield chunk.start, chunk.end


def lexical_adjacent_scores(texts):
    weights = inverse_document_frequency(texts)
    vectors = [embed(text, weights) for text in texts]
    return [cosine(left, right) for left, right in zip(vectors, vectors[1:])]


def semantic_chunks(document, size, threshold=0.15, adjacent_scores=lexical_adjacent_scores):
    """Place boundaries where neighboring sentences cease to be similar."""
    sentences = [
        span for left, right in section_spans(document)
        for span in split_at(document.text, left, right, SENTENCE_END)
    ]
    if not sentences:
        return
    texts = [document.text[left:right] for left, right in sentences]
    group_start, group_end = sentences[0]
    for (left, right), score in zip(sentences[1:], adjacent_scores(texts), strict=True):
        boundary = left != group_end or score < threshold
        if boundary or not fits(document.text, group_start, right, size):
            yield from windows(document, group_start, group_end, size, 0)
            group_start = left
        group_end = right
    yield from windows(document, group_start, group_end, size, 0)


def parent_child_pairs(document, size, overlap):
    for left, right in section_spans(document):
        for parent in windows(document, left, right, 3 * size, 0):
            for child in windows(document, parent.start, parent.end, size, overlap):
                yield child, parent


def chunk_document(document, strategy, size=18, overlap=6):
    if size < 1 or not 0 <= overlap < size:
        raise ValueError("chunk size must exceed overlap")
    end = len(document.text)
    if strategy in {"fixed", "overlap"}:
        return list(windows(document, 0, end, size, overlap if strategy == "overlap" else 0))
    if strategy == "recursive":
        return list(pack(document, recursive_spans(document, 0, end, size), size))
    if strategy == "section":
        return [chunk for left, right in section_spans(document)
                for chunk in windows(document, left, right, size, overlap)]
    if strategy == "semantic":
        return list(semantic_chunks(document, size))
    if strategy == "parent_child":
        return [child for child, _ in parent_child_pairs(document, size, overlap)]
    raise ValueError(f"unknown strategy: {strategy}")


def visible(document, question):
    return document.active and document.region in {question["region"], "global"} and (
        document.scope == "public" or question["role"] == "ops" and document.scope == "ops"
    )


def resolve_evidence(question, documents):
    spans = []
    for evidence in question["evidence"]:
        document = documents[evidence["doc"]]
        needle = evidence["needle"]
        if not visible(document, question) or not needle or document.text.count(needle) != 1:
            raise ValueError(f"evidence must be visible and unique: {question['id']} / {document.id}")
        start = document.text.index(needle)
        spans.append((document.id, start, start + len(needle)))
    return spans


def load_data(query_set="en"):
    corpus = json.loads((ROOT / "corpus.json").read_text(encoding="utf-8"))
    labels = json.loads((ROOT / "eval.json").read_text(encoding="utf-8"))
    if corpus["version"] != labels["corpus"]:
        raise ValueError("evaluation labels target a different corpus version")
    documents = {raw["id"]: parse(raw) for raw in corpus["documents"]}
    english = labels["queries"]
    originals = {question["id"]: question for question in english}
    crosslingual = [
        {**originals[variant["source_id"]], **variant}
        for variant in labels.get("crosslingual_queries", [])
    ]
    if len(documents) != len(corpus["documents"]) or len({q["id"] for q in english + crosslingual}) != len(english + crosslingual):
        raise ValueError("document and question IDs must be unique")
    for question in english + crosslingual:
        resolve_evidence(question, documents)
    if query_set == "crosslingual" and not crosslingual:
        raise ValueError("this evaluation set has no crosslingual queries")
    return documents, {"en": english, "crosslingual": crosslingual}[query_set]


def embed(text, idf=None):
    weights = Counter(tokens(text))
    if idf is not None:
        weights = {term: count * idf[term] for term, count in weights.items() if term in idf}
    length = sqrt(sum(value * value for value in weights.values()))
    return {term: value / length for term, value in weights.items()} if length else {}


def cosine(left, right):
    return sum(weight * right.get(term, 0.0) for term, weight in left.items())


def inverse_document_frequency(texts):
    seen = Counter(term for text in texts for term in set(tokens(text)))
    return {term: 1 + log((1 + len(texts)) / (1 + count)) for term, count in seen.items()}


def make_sparse_ranker(chunks, method):
    idf = inverse_document_frequency([chunk.text for chunk in chunks]) if method == "tfidf" else None
    vectors = [embed(chunk.text, idf) for chunk in chunks]

    def rank(query):
        query_vector = embed(query, idf)
        return select_ranked(chunks, [cosine(query_vector, vector) for vector in vectors], positive_only=True)

    return rank


def select_ranked(chunks, scores, positive_only):
    pairs = zip(chunks, scores, strict=True)
    return sorted(
        ((chunk, score) for chunk, score in pairs if score > 0 or not positive_only),
        key=lambda pair: (-pair[1], pair[0].doc, pair[0].start),
    )


def covers(chunk, span):
    doc, left, right = span
    return chunk.doc == doc and chunk.start <= left and chunk.end >= right


def evaluate(documents, questions, chunks, ranker_factory, k, explain=None, track_context=False):
    evidence_found = 0
    evidence_total = 0
    complete = 0
    answerable = 0
    reciprocal = 0.0
    no_label = 0
    no_label_retrieved = 0
    context_tokens = 0

    @cache
    def ranker_for(ids):
        return ranker_factory([chunk for chunk in chunks if chunk.doc in ids])

    for question in questions:
        spans = resolve_evidence(question, documents)
        allowed = tuple(document.id for document in documents.values() if visible(document, question))
        ranked = ranker_for(allowed)(question["query"])[:k]
        if track_context:
            context_tokens += sum(len(tokens(chunk.text)) for chunk, _ in ranked)
        if any(chunk.doc not in allowed for chunk, _ in ranked):
            raise AssertionError(f"scope leak: {question['id']}")
        if explain == question["id"]:
            print(f"query={question['id']} gold={spans}")
            for chunk, score in ranked:
                matched = [index + 1 for index, span in enumerate(spans) if covers(chunk, span)]
                preview = normalize(chunk.text)
                print(f"  {chunk.doc}[{chunk.start}:{chunk.end}] {score:.4f} gold={matched} {preview}")

        if not spans:
            no_label += 1
            no_label_retrieved += bool(ranked)
            continue
        found = [span for span in spans if any(covers(chunk, span) for chunk, _ in ranked)]
        first = next((rank for rank, (chunk, _) in enumerate(ranked, 1) if any(covers(chunk, span) for span in spans)), 0)
        evidence_found += len(found)
        evidence_total += len(spans)
        complete += len(found) == len(spans)
        answerable += 1
        reciprocal += 1 / first if first else 0

    result = {
        "evidence_recall": f"{evidence_found}/{evidence_total}",
        "complete_queries": f"{complete}/{answerable}",
        "mrr": round(reciprocal / answerable, 3) if answerable else 0,
        "unanswerable_with_candidates": f"{no_label_retrieved}/{no_label}",
    }
    if track_context:
        result["avg_context_tokens"] = round(context_tokens / len(questions), 1) if questions else 0
    return result


def all_chunks(documents, strategy, size, overlap):
    # Keep historical documents for the format lab. Index only active ones.
    return [chunk for doc in documents.values() if doc.active
            for chunk in chunk_document(doc, strategy, size, overlap)]


def parent_ranker(chunks, parents):
    rank_children = make_sparse_ranker(chunks, "tfidf")

    def rank(query):
        ranked = {}
        for child, score in rank_children(query):
            ranked.setdefault(parents[child], score)
        return list(ranked.items())

    return rank


def chunk_experiment(documents, questions, strategy, size, overlap, k, explain, semantic_signal=None):
    if semantic_signal is None:
        chunks = all_chunks(documents, strategy, size, overlap)
    else:
        threshold, adjacent_scores = semantic_signal
        chunks = [chunk for doc in documents.values() if doc.active
                  for chunk in semantic_chunks(doc, size, threshold, adjacent_scores)]
    if strategy == "parent_child":
        parents = dict(pair for doc in documents.values() if doc.active
                       for pair in parent_child_pairs(doc, size, overlap))
        assert all(child.doc == parent.doc and parent.start <= child.start < child.end <= parent.end
                   for child, parent in parents.items())

        def ranker(allowed):
            return parent_ranker(allowed, parents)

        searchable = set(parents.values())
    else:
        def ranker(allowed):
            return make_sparse_ranker(allowed, "tfidf")

        searchable = chunks
    spans = [span for question in questions for span in resolve_evidence(question, documents)]
    ceiling = sum(any(covers(chunk, span) for chunk in searchable) for span in spans)
    result = evaluate(documents, questions, chunks, ranker, k, explain, track_context=True)
    result["coverage_ceiling"] = f"{ceiling}/{len(spans)}"
    total_tokens = sum(len(tokens(chunk.text)) for chunk in chunks)
    label = "semantic-dense" if semantic_signal is not None else strategy
    print(f"{label}/tfidf: chunks={len(chunks)}, tokens={total_tokens}, {result}")


def verify(documents, questions):
    codes = documents["codes"]
    first_row = next(block for block in codes.blocks if block.kind == "table_row")
    assert first_row.text == "Code: REF-201 | Meaning: Pending payment | Action: Wait for payment settlement."
    assert "REF-999" not in codes.text
    assert "June archive" not in documents["cancel-us"].text
    assert embed("") == {} and abs(cosine(embed("payment payment"), embed("payment")) - 1) < 1e-9
    _, crosslingual = load_data("crosslingual")
    assert all(question["answer"].strip() for question in questions + crosslingual)
    for doc in documents.values():
        for block in doc.blocks:
            assert doc.text[block.start:block.end] == block.text
        for strategy in CHUNK_STRATEGIES:
            for chunk in chunk_document(doc, strategy):
                assert chunk.text == doc.text[chunk.start:chunk.end]
                assert 0 < len(tokens(chunk.text)) <= 18
        for child, parent in parent_child_pairs(doc, 18, 6):
            assert parent.start <= child.start < child.end <= parent.end
            assert len(tokens(parent.text)) <= 54
    assert not visible(documents["cancel-us-archive"], questions[0])
    ops_query = next(question for question in questions if question["id"] == "ops_queue")
    public_query = next(question for question in questions if question["id"] == "no_access")
    assert visible(documents["warehouse-ops"], ops_query)
    assert not visible(documents["warehouse-ops"], public_query)
    chunks = all_chunks(documents, "section", 18, 6)
    result = evaluate(documents, questions, chunks, lambda rows: make_sparse_ranker(rows, "tfidf"), 3)
    assert result["complete_queries"] == "12/12", result
    return len(crosslingual)


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["verify", "parse", "chunk", "embed"])
    parser.add_argument("--document", default="codes")
    parser.add_argument("--size", type=int, default=18)
    parser.add_argument("--overlap", type=int, default=6)
    parser.add_argument("--top-k", type=int, default=3)
    parser.add_argument("--query-set", choices=["en", "crosslingual"], default="en")
    parser.add_argument("--explain", help="show gold spans and candidate chunks for this query ID")
    args = parser.parse_args()
    if args.top_k < 1 or not 0 <= args.overlap < args.size:
        parser.error("top-k must be positive, and size must exceed overlap")
    if args.query_set != "en" and args.mode != "embed":
        parser.error("crosslingual is only available for the embedding experiment")
    documents, questions = load_data(args.query_set)
    if args.explain and args.explain not in {question["id"] for question in questions}:
        parser.error("unknown query ID")
    if args.mode == "verify":
        crosslingual_count = verify(documents, questions)
        print(f"Verified {len(documents)} documents, {len(questions)} English queries, "
              f"and {crosslingual_count} crosslingual queries.")
    elif args.mode == "parse":
        if args.document not in documents:
            parser.error("unknown document ID")
        print(json.dumps(asdict(documents[args.document]), indent=2, ensure_ascii=False))
    elif args.mode == "chunk":
        for strategy in CHUNK_STRATEGIES:
            chunk_experiment(documents, questions, strategy, args.size, args.overlap, args.top_k, args.explain)
    else:
        for method in ("count", "tfidf"):
            chunks = all_chunks(documents, "section", args.size, args.overlap)
            total_tokens = sum(len(tokens(chunk.text)) for chunk in chunks)
            result = evaluate(documents, questions, chunks, lambda rows: make_sparse_ranker(rows, method), args.top_k, args.explain)
            print(f"section/{method}: chunks={len(chunks)}, tokens={total_tokens}, {result}")


if __name__ == "__main__":
    main()
