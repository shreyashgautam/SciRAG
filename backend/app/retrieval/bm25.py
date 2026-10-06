from typing import Any, Dict, List, Optional
from app.db.vector_search import execute_atlas_search_bm25


async def bm25_retrieve(
    query: str,
    owner_id: str,
    paper_ids: Optional[List[str]] = None,
    top_k: int = 10
) -> List[Dict[str, Any]]:
    """
    Perform full-text/BM25 keyword retrieval using MongoDB Atlas Search.
    Strictly isolated by owner_id.
    """
    results = await execute_atlas_search_bm25(
        query_text=query,
        owner_id=owner_id,
        paper_ids=paper_ids,
        top_k=top_k
    )
    for r in results:
        r["retrieval_method"] = "bm25"
    return results
