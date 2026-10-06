from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.research import PaperComparisonRequest, PaperComparisonResponse
from app.services.comparison_service import comparison_service

router = APIRouter(prefix="/compare", tags=["Paper Comparison"])


@router.post("", response_model=PaperComparisonResponse)
async def compare_papers(
    req: PaperComparisonRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Compare 2-4 research papers across Methodology, Datasets, Results, and Limitations.
    """
    return await comparison_service.compare_papers(req.paper_ids, current_user.id)
