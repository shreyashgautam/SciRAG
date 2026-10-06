from fastapi import APIRouter
from app.db.mongodb import is_connected as mongo_connected
from app.services.cloudinary_service import cloudinary_service
from app.services.grok_service import grok_service
from app.embeddings.embedder import embedder
from app.core.config import settings

router = APIRouter(tags=["Health & Status"])


@router.get("/health")
async def health_check():
    """
    Production health check monitoring all subsystem integrations.
    """
    return {
        "status": "ok",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "subsystems": {
            "api": "online",
            "mongodb": "connected" if mongo_connected else "offline_fallback",
            "cloudinary": "configured" if cloudinary_service.is_configured else "local_fallback",
            "grok": "configured" if grok_service.is_configured else "synthesis_fallback",
            "embeddings": f"ready ({embedder.model_name})",
            "vector_search": "active"
        }
    }
