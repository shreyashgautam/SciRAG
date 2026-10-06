from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import UserModel

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.get("")
async def get_insights(current_user: UserModel = Depends(get_current_user)):
    """Retrieve trending topics and cross-corpus analytical insights."""
    return [
        {
            "id": "insight-1",
            "category": "emerging_topic",
            "title": "Graph-based RAG & Community Summarization",
            "description": "Transitioning from flat dense chunk retrieval to hierarchical community graph extraction allows global thematic queries to be addressed without lost context.",
            "metrics": {"growthRate": "+184%", "paperCount": 18, "confidence": 0.94},
            "papers": ["rag-lewis-2020", "graphrag-edge-2024"]
        },
        {
            "id": "insight-2",
            "category": "methodology",
            "title": "Adaptive Self-Reflective Retrieval",
            "description": "Injecting self-critique tokens [IsSUP] and [IsREL] into generator vocabularies drastically penalizes hallucinated claims outside retrieved passages.",
            "metrics": {"growthRate": "+112%", "paperCount": 14, "confidence": 0.91},
            "papers": ["self-rag-asai-2023", "crag-yan-2024"]
        },
        {
            "id": "insight-3",
            "category": "benchmark",
            "title": "Hybrid Dense + Sparse Reciprocal Rank Fusion",
            "description": "Pairing BGE-M3 embeddings with BM25 keyword matching via Reciprocal Rank Fusion yields state-of-the-art context precision on complex scientific terminology.",
            "metrics": {"growthRate": "+95%", "paperCount": 26, "confidence": 0.96},
            "papers": ["rag-survey-gao-2023", "dpr-karpukhin-2020"]
        }
    ]
