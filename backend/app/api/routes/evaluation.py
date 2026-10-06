from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.evaluation import (
    RagasEvaluationRequest,
    BaselineComparisonRequest,
    EvaluationResultResponse
)
from app.services.evaluation_service import evaluation_service

router = APIRouter(prefix="/evaluation", tags=["RAG Evaluation"])


@router.post("/ragas", response_model=EvaluationResultResponse)
async def evaluate_ragas(
    req: RagasEvaluationRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Run RAGAS evaluation on query, generated answer, and retrieved contexts.
    Measures Faithfulness, Answer Relevance, Context Precision, and Context Recall.
    """
    eval_model = await evaluation_service.evaluate_ragas(
        user_id=current_user.id,
        query=req.query,
        answer=req.answer,
        contexts=req.contexts,
        ground_truth=req.ground_truth
    )
    return EvaluationResultResponse(
        id=eval_model.id,
        user_id=eval_model.user_id,
        evaluation_type=eval_model.evaluation_type,
        query=eval_model.query,
        answer=eval_model.answer,
        metrics=eval_model.metrics.model_dump(),
        baseline_comparison=eval_model.baseline_comparison,
        created_at=eval_model.created_at
    )


@router.post("/baseline")
async def compare_baseline(
    req: BaselineComparisonRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Comparative experiment: Standalone LLM baseline vs SciRAG hybrid grounded pipeline.
    """
    return await evaluation_service.compare_baseline(
        user_id=current_user.id,
        queries=req.queries,
        paper_ids=req.paper_ids
    )


@router.get("/results")
async def list_evaluation_results(current_user: UserModel = Depends(get_current_user)):
    """List historical evaluation runs."""
    return await evaluation_service.list_user_evaluations(current_user.id)
