from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class EvaluationMetricsModel(BaseModel):
    faithfulness: float = 0.0
    answer_relevance: float = 0.0
    context_precision: float = 0.0
    context_recall: float = 0.0
    citation_correctness: float = 0.0


class EvaluationModel(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    evaluation_type: str = "ragas"  # "ragas" | "baseline" | "citation_audit"
    query: str
    answer: str
    retrieved_contexts: List[str] = Field(default_factory=list)
    ground_truth: Optional[str] = None
    metrics: EvaluationMetricsModel = Field(default_factory=EvaluationMetricsModel)
    baseline_comparison: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
