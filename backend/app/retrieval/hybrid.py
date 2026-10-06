from typing import Any, Dict, List, Optional
from app.retrieval.dense import dense_retrieve
from app.retrieval.bm25 import bm25_retrieve
from app.retrieval.fusion import reciprocal_rank_fusion
from app.retrieval.reranker import reranker
from app.core.config import settings


async def hybrid_retrieve(
    query: str,
    owner_id: str,
    paper_ids: Optional[List[str]] = None,
    top_k: int = settings.TOP_K_HYBRID,
    enable_rerank: bool = True
) -> List[Dict[str, Any]]:
    """
    Complete Hybrid Retrieval Pipeline:
    Query -> (Dense Vector Search + BM25 Full-text Search) -> RRF Score Fusion -> CrossEncoder Rerank
    """
    # 1. Parallel candidate generation
    dense_candidates = await dense_retrieve(
        query=query,
        owner_id=owner_id,
        paper_ids=paper_ids,
        top_k=settings.TOP_K_DENSE
    )
    bm25_candidates = await bm25_retrieve(
        query=query,
        owner_id=owner_id,
        paper_ids=paper_ids,
        top_k=settings.TOP_K_BM25
    )

    # 2. Reciprocal Rank Fusion
    fused_candidates = reciprocal_rank_fusion(
        dense_results=dense_candidates,
        bm25_results=bm25_candidates,
        top_k=top_k * 2
    )

    # 3. CrossEncoder Reranking
    if enable_rerank and fused_candidates:
        final_results = reranker.rerank(
            query=query,
            candidates=fused_candidates,
            top_k=top_k
        )
        return final_results

    return fused_candidates[:top_k]
