from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.research import (
    ResearchGapsRequest,
    ResearchGapsResponse,
    DeepResearchRequest,
    DeepResearchResponse
)
from app.services.research_gap_service import research_gap_service
from app.rag.agentic_research import run_controlled_deep_research

router = APIRouter(prefix="/research", tags=["Deep Research & Gaps"])


@router.post("/gaps", response_model=ResearchGapsResponse)
async def discover_research_gaps(
    req: ResearchGapsRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Extract stated limitations and identify open research gaps across selected literature.
    """
    return await research_gap_service.discover_gaps(
        paper_ids=req.paper_ids,
        owner_id=current_user.id,
        topic=req.topic
    )


@router.post("/deep", response_model=DeepResearchResponse)
async def deep_research(
    req: DeepResearchRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Execute controlled iterative deep research loop (max 3 iterations).
    """
    res = await run_controlled_deep_research(
        query=req.query,
        owner_id=current_user.id,
        paper_ids=req.paper_ids,
        max_iterations=req.max_iterations
    )
    return DeepResearchResponse(
        query=res["query"],
        steps=res["steps"],
        final_answer=res["final_answer"],
        citations=res["citations"]
    )
