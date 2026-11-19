"""Compare two local dense encoders against the shared RAG exact-search fixture."""
from argparse import ArgumentParser
from importlib.metadata import version
from pathlib import Path

from fastembed import TextEmbedding
import numpy as np

from rag_lab import all_chunks, chunk_experiment, evaluate, load_data, select_ranked


ENGLISH_MODELS = ("BAAI/bge-small-en-v1.5", "sentence-transformers/all-MiniLM-L6-v2")
MULTILINGUAL_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


def unit(rows):
    vectors = np.asarray(list(rows), dtype=np.float32)
    norms = np.linalg.norm(vectors, axis=-1, keepdims=True)
    if not np.isfinite(vectors).all() or np.any(norms == 0):
        raise ValueError("empty or non-finite embedding")
    return vectors / norms


def load_model(model_name, options):
    return TextEmbedding(
        model_name=model_name,
        cache_dir=str(options.cache_dir),
        threads=2,
        local_files_only=options.offline,
    )


def compare(model_name, options, documents, questions, chunks):
    model = load_model(model_name, options)
    passages = unit(model.passage_embed([chunk.text for chunk in chunks]))
    queries = unit(model.query_embed([question["query"] for question in questions]))
    if options.project_dim is not None:
        if options.project_dim >= passages.shape[1]:
            raise ValueError("project-dim must be smaller than the model output dimension")
        generator = np.random.default_rng(7)
        projection = generator.standard_normal((passages.shape[1], options.project_dim), dtype=np.float32)
        passages = unit(passages @ projection)
        queries = unit(queries @ projection)
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
    parser.add_argument("--model", choices=(*ENGLISH_MODELS, MULTILINGUAL_MODEL), action="append")
    parser.add_argument("--top-k", type=int, default=3)
    parser.add_argument("--query-set", choices=["en", "crosslingual"], default="en")
    parser.add_argument("--project-dim", type=int, help="apply the same seeded random projection to both towers")
    parser.add_argument("--semantic-chunks", type=float, metavar="SIMILARITY_THRESHOLD",
                        help="test dense sentence boundaries with fixed TF-IDF retrieval")
    parser.add_argument("--explain", help="print ranked evidence for a query ID")
    options = parser.parse_args()
    documents, questions = load_data(options.query_set)
    if options.top_k < 1 or (options.project_dim is not None and options.project_dim < 1):
        parser.error("top-k and project-dim must be positive")
    if options.explain and options.explain not in {question["id"] for question in questions}:
        parser.error("unknown query ID")
    if options.semantic_chunks is not None:
        if not -1 <= options.semantic_chunks <= 1 or options.project_dim is not None:
            parser.error("semantic threshold must be between -1 and 1 with no projection")
        names = options.model or [ENGLISH_MODELS[1]]
        for name in names:
            model = load_model(name, options)

            def adjacent_scores(sentences):
                vectors = unit(model.passage_embed(sentences))
                return np.einsum("ij,ij->i", vectors[:-1], vectors[1:])

            print(f"{name}; sentence threshold={options.semantic_chunks}")
            chunk_experiment(documents, questions, "semantic", 18, 6, options.top_k, options.explain,
                             semantic_signal=(options.semantic_chunks, adjacent_scores))
        return
    chunks = all_chunks(documents, "section", 18, 6)
    defaults = ENGLISH_MODELS if options.query_set == "en" else (ENGLISH_MODELS[1], MULTILINGUAL_MODEL)
    print(f"FastEmbed {version('fastembed')}; section/18/6; {options.query_set}; top-k={options.top_k}", flush=True)
    for name in options.model or defaults:
        compare(name, options, documents, questions, chunks)


if __name__ == "__main__":
    main()
