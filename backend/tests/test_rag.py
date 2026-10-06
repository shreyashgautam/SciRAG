import pytest
from app.rag.context_builder import build_evidence_context
from app.rag.citation_grounder import ground_and_validate_citations
from app.retrieval.fusion import reciprocal_rank_fusion


def test_reciprocal_rank_fusion():
    dense = [
        {"_id": "doc1", "text": "Dense top 1", "score": 0.95},
        {"_id": "doc2", "text": "Dense top 2", "score": 0.88}
    ]
    bm25 = [
        {"_id": "doc2", "text": "Dense top 2", "score": 12.4},
        {"_id": "doc3", "text": "BM25 top 2", "score": 10.1}
    ]
    fused = reciprocal_rank_fusion(dense, bm25, k_constant=60, top_k=3)
    assert len(fused) == 3
    # doc2 appeared in both rankings, should be ranked #1
    assert fused[0]["_id"] == "doc2"


def test_citation_grounding_and_hallucination_filtering():
    raw_response = (
        "Retrieval-Augmented Generation reduces hallucination [S1]. "
        "Furthermore, critique tokens regulate outputs [S2]. "
        "However, unsupported speculation occurs in phantom papers [S99]."
    )
    source_mapping = {
        "S1": {
            "source_key": "S1", "number": 1, "chunk_id": "c1", "paper_id": "p1",
            "paper_title": "RAG Paper", "authors": "Lewis et al.", "year": 2020,
            "page": 2, "section": "Arch", "relevance_score": 94, "excerpt": "RAG reduces hallucination."
        },
        "S2": {
            "source_key": "S2", "number": 2, "chunk_id": "c2", "paper_id": "p2",
            "paper_title": "Self-RAG", "authors": "Asai et al.", "year": 2024,
            "page": 4, "section": "Tokens", "relevance_score": 88, "excerpt": "Critique tokens."
        }
    }

    grounded_answer, citations = ground_and_validate_citations(raw_response, source_mapping)

    # Citations S1 and S2 mapped to [1] and [2]
    assert "[1]" in grounded_answer
    assert "[2]" in grounded_answer
    # Hallucinated S99 stripped out
    assert "[S99]" not in grounded_answer
    assert len(citations) == 2
    assert citations[0]["number"] == 1
    assert citations[1]["number"] == 2
