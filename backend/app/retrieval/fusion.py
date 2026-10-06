from typing import Any, Dict, List


def reciprocal_rank_fusion(
    dense_results: List[Dict[str, Any]],
    bm25_results: List[Dict[str, Any]],
    k_constant: int = 60,
    top_k: int = 10
) -> List[Dict[str, Any]]:
    """
    Combine dense and BM25 results using Reciprocal Rank Fusion (RRF).
    Formula: RRF_score(d) = sum_{m in models} 1 / (k_constant + rank_m(d))
    """
    fused_scores: Dict[str, float] = {}
    doc_registry: Dict[str, Dict[str, Any]] = {}

    # Score Dense rankings
    for rank, doc in enumerate(dense_results):
        doc_id = str(doc.get("_id") or doc.get("id"))
        doc_registry[doc_id] = doc
        score = 1.0 / (k_constant + rank + 1)
        fused_scores[doc_id] = fused_scores.get(doc_id, 0.0) + score

    # Score BM25 rankings
    for rank, doc in enumerate(bm25_results):
        doc_id = str(doc.get("_id") or doc.get("id"))
        if doc_id not in doc_registry:
            doc_registry[doc_id] = doc
        score = 1.0 / (k_constant + rank + 1)
        fused_scores[doc_id] = fused_scores.get(doc_id, 0.0) + score

    # Sort merged candidate list by combined score
    sorted_ids = sorted(fused_scores.keys(), key=lambda did: fused_scores[did], reverse=True)

    final_results = []
    for did in sorted_ids[:top_k]:
        candidate = doc_registry[did].copy()
        candidate["fusion_score"] = fused_scores[did]
        # Normalize relative score to 0..1 range
        candidate["score"] = min(1.0, fused_scores[did] * k_constant)
        candidate["retrieval_method"] = "hybrid_rrf"
        final_results.append(candidate)

    return final_results
