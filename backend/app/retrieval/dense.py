from typing import Any, Dict, List, Optional
from app.embeddings.embedder import embed_query
from app.db.vector_search import execute_vector_search


async def dense_retrieve(
    query: str,
    owner_id: str,
    paper_ids: Optional[List[str]] = None,
    top_k: int = 10
) -> List[Dict[str, Any]]:
    """
    Perform dense vector retrieval:
    Query -> Embedder -> MongoDB Vector Search -> Scored Candidates.
    Strictly isolated by owner_id.
    """
    query_vector = embed_query(query)
    results = await execute_vector_search(
        query_vector=query_vector,
        owner_id=owner_id,
        paper_ids=paper_ids,
        top_k=top_k
    )
    for r in results:
        r["retrieval_method"] = "dense"
    return results
