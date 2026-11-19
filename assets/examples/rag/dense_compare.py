"""Compare two local dense encoders against the shared RAG exact-search fixture."""
from argparse import ArgumentParser
from importlib.metadata import version
from pathlib import Path

from fastembed import TextEmbedding
import numpy as np

from rag_lab import all_chunks, evaluate, load_data, select_ranked


MODELS = ("BAAI/bge-small-en-v1.5", "sentence-transformers/all-MiniLM-L6-v2")


def unit(rows):
    vectors = np.asarray(list(rows), dtype=np.float32)
    norms = np.linalg.norm(vectors, axis=-1, keepdims=True)
    if not np.isfinite(vectors).all() or np.any(norms == 0):
        raise ValueError("empty or non-finite embedding")
    return vectors / norms


def compare(model_name, options, documents, questions, chunks):
    model = TextEmbedding(
        model_name=model_name,
        cache_dir=str(options.cache_dir),
        threads=2,
        local_files_only=options.offline,
    )
    passages = unit(model.passage_embed([chunk.text for chunk in chunks]))
    queries = unit(model.query_embed([question["query"] for question in questions]))
    passage_index = {chunk: index for index, chunk in enumerate(chunks)}
    query_vectors = {question["query"]: queries[index] for index, question in enumerate(questions)}

    def build_ranker(allowed):
        if not allowed:
            return lambda _: []
        visible_passages = passages[[passage_index[chunk] for chunk in allowed]]

        def rank(query):
            scores = visible_passages @ query_vectors[query]
            return select_ranked(allowed, scores, positive_only=False)

        return rank

    metrics = evaluate(documents, questions, chunks, build_ranker, options.top_k, options.explain)
    print(f"{model_name}: {passages.shape[1]} dimensions, {metrics}", flush=True)


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--cache-dir", type=Path, default=Path("rag-model-cache"))
    parser.add_argument("--offline", action="store_true", help="use only locally cached model files")
    parser.add_argument("--model", choices=MODELS, action="append", help="compare both encoders unless selected")
    parser.add_argument("--top-k", type=int, default=3)
    parser.add_argument("--explain", help="print ranked evidence for a query ID")
    options = parser.parse_args()
    documents, questions = load_data()
    if options.top_k < 1:
        parser.error("top-k must be positive")
    if options.explain and options.explain not in {question["id"] for question in questions}:
        parser.error("unknown query ID")
    chunks = all_chunks(documents, "section", 18, 6)
    print(f"FastEmbed {version('fastembed')}; section/18/6; top-k={options.top_k}", flush=True)
    for name in options.model or MODELS:
        compare(name, options, documents, questions, chunks)


if __name__ == "__main__":
    main()
