from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ChatCitationSchema(BaseModel):
    id: str
    number: int
    paper_id: str
    paper_title: str
    authors: str
    year: int
    page: int
    section: str
    relevance_score: int
    excerpt: str


class ChatRequest(BaseModel):
    message: str
    paper_ids: Optional[List[str]] = Field(default_factory=list)
    collection_id: Optional[str] = None
    conversation_id: Optional[str] = None
    research_mode: str = "grounded"  # "grounded" | "deep_research"
    retrieval_mode: str = "hybrid"  # "hybrid" | "dense" | "bm25"


class ChatResponseData(BaseModel):
    answer: str
    citations: List[ChatCitationSchema] = Field(default_factory=list)
    sources: List[Dict[str, Any]] = Field(default_factory=list)
    retrieval: Dict[str, Any] = Field(default_factory=dict)
    latency_ms: float = 0.0
    conversation_id: str


class ChatResponse(BaseModel):
    success: bool = True
    data: ChatResponseData


class CreateConversationRequest(BaseModel):
    title: str = "New Research Inquiry"
    scope_paper_ids: List[str] = Field(default_factory=list)
