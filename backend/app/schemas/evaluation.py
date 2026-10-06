from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class RagasEvaluationRequest(BaseModel):
    query: str
    answer: str
    contexts: List[str]
    ground_truth: Optional[str] = None


class BaselineComparisonRequest(BaseModel):
    queries: List[str]
    paper_ids: List[str]


class EvaluationResultResponse(BaseModel):
    id: str
    user_id: str
    evaluation_type: str
    query: str
    answer: str
    metrics: Dict[str, float]
    baseline_comparison: Optional[Dict[str, Any]] = None
    created_at: datetime
