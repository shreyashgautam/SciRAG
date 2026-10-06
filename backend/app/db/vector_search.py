from typing import Any, Dict, List, Optional
import numpy as np
from app.db.mongodb import get_database
from app.core.logging import logger


async def execute_vector_search(
    query_vector: List[float],
    owner_id: str,
    paper_ids: Optional[List[str]] = None,
    top_k: int = 10,
    index_name: str = "vector_index",
    path: str = "embedding"
) -> List[Dict[str, Any]]:
    """
    Execute MongoDB Atlas Vector Search with strictly enforced owner_id isolation.
    """
    db = get_database()
    if db is None:
        return []

    # Build filter for user isolation and optional paper scoping
    filter_criteria: Dict[str, Any] = {"owner_id": owner_id}
    if paper_ids and len(paper_ids) > 0:
        filter_criteria["paper_id"] = {"$in": paper_ids}

    pipeline = [
        {
            "$vectorSearch": {
                "index": index_name,
                "path": path,
                "queryVector": query_vector,
                "numCandidates": max(top_k * 10, 100),
                "limit": top_k,
                "filter": filter_criteria
            }
        },
        {
            "$project": {
                "_id": 1,
                "paper_id": 1,
                "owner_id": 1,
                "section": 1,
                "page_number": 1,
                "chunk_index": 1,
                "text": 1,
                "token_count": 1,
                "metadata": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]

    try:
        cursor = db.chunks.aggregate(pipeline)
        results = await cursor.to_list(length=top_k)
        return results
    except Exception as e:
        logger.warning(f"Atlas Vector Search failed or not enabled on cluster: {e}. Executing in-memory cosine fallback.")
        # Fallback: Query candidates matching owner_id and calculate exact cosine similarity
        query_filter: Dict[str, Any] = {"owner_id": owner_id}
        if paper_ids and len(paper_ids) > 0:
            query_filter["paper_id"] = {"$in": paper_ids}

        cursor = db.chunks.find(query_filter).limit(200)
        docs = await cursor.to_list(length=200)
        if not docs:
            return []

        q_vec = np.array(query_vector, dtype=np.float32)
        q_norm = np.linalg.norm(q_vec)
        if q_norm == 0:
            return []

        scored_docs = []
        for d in docs:
            emb = d.get("embedding")
            if emb and len(emb) == len(query_vector):
                d_vec = np.array(emb, dtype=np.float32)
                d_norm = np.linalg.norm(d_vec)
                if d_norm > 0:
                    score = float(np.dot(q_vec, d_vec) / (q_norm * d_norm))
                    d["score"] = max(0.0, min(1.0, (score + 1.0) / 2.0))
                    scored_docs.append(d)

        scored_docs.sort(key=lambda x: x.get("score", 0), reverse=True)
        return scored_docs[:top_k]


async def execute_atlas_search_bm25(
    query_text: str,
    owner_id: str,
    paper_ids: Optional[List[str]] = None,
    top_k: int = 10,
    index_name: str = "default"
) -> List[Dict[str, Any]]:
    """
    Execute MongoDB Atlas Search full-text/BM25 query with owner_id boundary.
    """
    db = get_database()
    if db is None:
        return []

    pipeline = [
        {
            "$search": {
                "index": index_name,
                "compound": {
                    "must": [
                        {
                            "text": {
                                "query": query_text,
                                "path": "text"
                            }
                        }
                    ],
                    "filter": [
                        {
                            "equals": {
                                "value": owner_id,
                                "path": "owner_id"
                            }
                        }
                    ]
                }
            }
        },
        {
            "$limit": top_k
        },
        {
            "$project": {
                "_id": 1,
                "paper_id": 1,
                "owner_id": 1,
                "section": 1,
                "page_number": 1,
                "chunk_index": 1,
                "text": 1,
                "token_count": 1,
                "metadata": 1,
                "score": {"$meta": "searchScore"}
            }
        }
    ]

    try:
        cursor = db.chunks.aggregate(pipeline)
        return await cursor.to_list(length=top_k)
    except Exception as e:
        logger.info(f"Atlas Search index unavailable ({e}); falling back to standard text matching.")
        # Regex / text fallback
        query_filter: Dict[str, Any] = {
            "owner_id": owner_id,
            "text": {"$regex": query_text.split()[0] if query_text else "", "$options": "i"}
        }
        if paper_ids and len(paper_ids) > 0:
            query_filter["paper_id"] = {"$in": paper_ids}
        cursor = db.chunks.find(query_filter).limit(top_k)
        docs = await cursor.to_list(length=top_k)
        for i, doc in enumerate(docs):
            doc["score"] = 1.0 - (i * 0.05)
        return docs
