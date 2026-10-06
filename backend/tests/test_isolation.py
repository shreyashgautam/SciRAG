import pytest
from app.services.paper_service import PaperService
from app.core.exceptions import AuthorizationError, ResourceNotFoundError
from app.schemas.paper import PaperResponse


@pytest.mark.asyncio
async def test_cross_user_isolation_strictly_enforced():
    """
    SECURITY TEST: Prove that User B cannot retrieve User A's private research paper.
    """
    service = PaperService()

    user_a_id = "usr-alice-01"
    user_b_id = "usr-bob-02"
    paper_id = "paper-secret-quantum-rag"

    # Seed User A's paper in memory store
    from app.services.paper_service import _memory_papers
    _memory_papers[paper_id] = {
        "_id": paper_id,
        "owner_id": user_a_id,
        "title": "Confidential Quantum RAG Formulations",
        "authors": [{"name": "Dr. Alice"}],
        "abstract": "Proprietary research findings.",
        "year": 2025,
        "venue": "Private Lab",
        "source": "pdf",
        "page_count": 5,
        "sections": [],
        "tags": ["Confidential"],
        "collection_ids": [],
        "status": "ready",
        "processing_progress": 100,
        "chunk_count": 10,
        "is_favorite": False,
        "created_at": "2025-01-01T00:00:00Z"
    }

    # 1. User A can successfully access their own paper
    paper_alice = await service.get_paper(paper_id, owner_id=user_a_id)
    assert paper_alice.id == paper_id
    assert paper_alice.owner_id == user_a_id

    # 2. User B attempting to access User A's paper MUST raise AuthorizationError
    with pytest.raises(AuthorizationError) as exc_info:
        await service.get_paper(paper_id, owner_id=user_b_id)
    assert "Access denied" in str(exc_info.value.detail)
