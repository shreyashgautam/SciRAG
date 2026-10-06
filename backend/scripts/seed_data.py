import asyncio
import sys
import os
from datetime import datetime, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.mongodb import connect_db, close_db
from app.core.security import get_password_hash
from app.embeddings.embedder import embed_documents
from app.core.logging import logger


async def seed():
    logger.info("Seeding marked DEMO DATA for SciRAG...")
    db = await connect_db()
    if db is None:
        logger.warning("MongoDB unavailable; seed skipped.")
        return

    now = datetime.now(timezone.utc)

    # 1. Seed Demo User
    demo_user = {
        "_id": "usr-demo-01",
        "name": "Dr. Elena Rostova",
        "email": "e.rostova@scirag.io",
        "password_hash": get_password_hash("password123"),
        "role": "admin",
        "research_interests": ["Retrieval-Augmented Generation", "Vector Search", "Hallucination Mitigation"],
        "is_verified": True,
        "is_demo_data": True,
        "created_at": now,
        "updated_at": now
    }
    await db.users.update_one({"_id": demo_user["_id"]}, {"$set": demo_user}, upsert=True)

    # 2. Seed Demo Paper (Lewis et al. NeurIPS 2020)
    paper_id = "rag-lewis-2020"
    demo_paper = {
        "_id": paper_id,
        "owner_id": "usr-demo-01",
        "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        "authors": [
            {"name": "Patrick Lewis", "affiliation": "Facebook AI Research & UCL"},
            {"name": "Douwe Kiela", "affiliation": "Facebook AI Research"}
        ],
        "abstract": "Large pre-trained language models store substantial factual knowledge within their parameters. We propose retrieval-augmented generation (RAG) — models combining pre-trained parametric and non-parametric memory.",
        "year": 2020,
        "venue": "NeurIPS 2020",
        "doi": "10.48550/arXiv.2005.11401",
        "source": "arxiv",
        "source_url": "https://arxiv.org/abs/2005.11401",
        "page_count": 19,
        "sections": [
            {
                "id": "sec-abstract",
                "title": "Abstract",
                "page": 1,
                "content": "Large pre-trained language models store substantial factual knowledge within their parameters and achieve state-of-the-art results on downstream NLP tasks. We develop RAG architectures combining seq2seq generators with non-parametric dense vector indices."
            },
            {
                "id": "sec-related",
                "title": "2. Related Work & Model Architecture",
                "page": 2,
                "content": "Retrieval-Augmented Generation reduces reliance on information stored only within model parameters by introducing external evidence during generation. We formulate RAG-Token and RAG-Sequence where passage retrieval conditions token distribution directly."
            }
        ],
        "tags": ["RAG", "DPR", "BART"],
        "collection_ids": [],
        "status": "ready",
        "processing_progress": 100,
        "chunk_count": 2,
        "is_favorite": True,
        "is_demo_data": True,
        "created_at": now,
        "updated_at": now
    }
    await db.papers.update_one({"_id": paper_id}, {"$set": demo_paper}, upsert=True)

    # 3. Seed Demo Chunks with Embeddings
    chunk_texts = [
        "Large pre-trained language models store substantial factual knowledge within their parameters. We develop RAG architectures combining seq2seq generators with non-parametric dense vector indices.",
        "Retrieval-Augmented Generation reduces reliance on information stored only within model parameters by introducing external evidence during generation. We formulate RAG-Token and RAG-Sequence where passage retrieval conditions token distribution directly."
    ]
    embeddings = embed_documents(chunk_texts)

    demo_chunks = [
        {
            "_id": f"chk_{paper_id}_0001",
            "paper_id": paper_id,
            "owner_id": "usr-demo-01",
            "section": "Abstract",
            "page_number": 1,
            "chunk_index": 0,
            "text": chunk_texts[0],
            "token_count": 42,
            "embedding": embeddings[0],
            "metadata": {"paper_title": demo_paper["title"], "authors": "Lewis et al.", "year": 2020, "page": 1, "section": "Abstract"},
            "is_demo_data": True,
            "created_at": now
        },
        {
            "_id": f"chk_{paper_id}_0002",
            "paper_id": paper_id,
            "owner_id": "usr-demo-01",
            "section": "2. Related Work & Model Architecture",
            "page_number": 2,
            "chunk_index": 1,
            "text": chunk_texts[1],
            "token_count": 52,
            "embedding": embeddings[1],
            "metadata": {"paper_title": demo_paper["title"], "authors": "Lewis et al.", "year": 2020, "page": 2, "section": "2. Related Work"},
            "is_demo_data": True,
            "created_at": now
        }
    ]

    for chunk in demo_chunks:
        await db.chunks.update_one({"_id": chunk["_id"]}, {"$set": chunk}, upsert=True)

    await close_db()
    logger.info("Demo data seeding completed.")


if __name__ == "__main__":
    asyncio.run(seed())
