from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.paper import PaperSummarySchema
from app.services.summary_service import summary_service

router = APIRouter(prefix="/summaries", tags=["Summaries"])


class MultiPaperSummaryRequest(BaseModel):
    paper_ids: List[str]


@router.post("/paper/{paper_id}", response_model=PaperSummarySchema)
async def summarize_single_paper(paper_id: str, current_user: UserModel = Depends(get_current_user)):
    """Generate structured literature synthesis (TL;DR, Problem, Methods, etc.) for a paper."""
    return await summary_service.summarize_paper(paper_id, current_user.id)


@router.post("/multi-paper")
async def summarize_multi_paper(req: MultiPaperSummaryRequest, current_user: UserModel = Depends(get_current_user)):
    """Synthesize cross-corpus findings, differences, and trends across multiple papers."""
    return await summary_service.summarize_multi_paper(req.paper_ids, current_user.id)
