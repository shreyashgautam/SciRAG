from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.search import SearchResponse, SearchResultItem
from app.retrieval.hybrid import hybrid_retrieve
from app.retrieval.dense import dense_retrieve
from app.retrieval.bm25 import bm25_retrieve

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", response_model=SearchResponse)
async def search_literature(
    q: str = Query(..., min_length=2, description="Search query string"),
    mode: str = Query("hybrid", regex="^(hybrid|semantic|keyword)$"),
    top_k: int = Query(10, ge=1, le=50),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Search literature corpus across owned papers using Dense, BM25, or Hybrid retrieval.
    """
    if mode == "semantic":
        candidates = await dense_retrieve(query=q, owner_id=current_user.id, top_k=top_k)
    elif mode == "keyword":
        candidates = await bm25_retrieve(query=q, owner_id=current_user.id, top_k=top_k)
    else:
        candidates = await hybrid_retrieve(query=q, owner_id=current_user.id, top_k=top_k)

    results = []
    for c in candidates:
        meta = c.get("metadata", {})
        results.append(SearchResultItem(
            chunk_id=str(c.get("_id") or c.get("id")),
            paper_id=c.get("paper_id", ""),
            paper_title=meta.get("paper_title") or c.get("paper_title", "Literature Document"),
            authors=meta.get("authors") or c.get("authors", "Author"),
            year=meta.get("year") or c.get("year", 2024),
            page=c.get("page_number") or meta.get("page", 1),
            section=c.get("section") or meta.get("section", "Section"),
            text=c.get("text", ""),
            score=round(float(c.get("rerank_score", c.get("score", 0.8))), 3),
            retrieval_method=c.get("retrieval_method", mode)
        ))

    return SearchResponse(
        query=q,
        mode=mode,
        total_found=len(results),
        results=results
    )
