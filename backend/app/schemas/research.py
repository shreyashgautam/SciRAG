from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PaperComparisonRequest(BaseModel):
    paper_ids: List[str] = Field(min_length=2, max_length=4)


class ComparisonDimension(BaseModel):
    dimension: str
    values: Dict[str, str]  # paper_id -> summary string


class PaperComparisonResponse(BaseModel):
    paper_ids: List[str]
    dimensions: List[ComparisonDimension]
    synthesis: str


class ResearchGapsRequest(BaseModel):
    paper_ids: List[str]
    topic: Optional[str] = None


class ResearchGapItem(BaseModel):
    id: str
    gap: str
    description: str
    supporting_papers: List[str]
    supporting_evidence: List[str]
    confidence: float
    limitations: str


class ResearchGapsResponse(BaseModel):
    gaps: List[ResearchGapItem]
    synthesis_summary: str


class DeepResearchRequest(BaseModel):
    query: str
    paper_ids: List[str]
    max_iterations: int = 3


class DeepResearchStep(BaseModel):
    iteration: int
    query: str
    retrieved_count: int
    decision: str


class DeepResearchResponse(BaseModel):
    query: str
    steps: List[DeepResearchStep]
    final_answer: str
    citations: List[Dict[str, Any]]
