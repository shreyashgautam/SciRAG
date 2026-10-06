from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import logger
from app.core.middleware import SecurityAndObservabilityMiddleware
from app.db.mongodb import connect_db, close_db
from app.db.indexes import create_all_indexes

# Route imports
from app.api.routes import (
    auth,
    users,
    papers,
    uploads,
    search,
    retrieval,
    chat,
    citations,
    collections,
    summaries,
    compare,
    research,
    insights,
    evaluation,
    health
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Initializing {settings.APP_NAME} FastAPI backend [{settings.APP_ENV}]...")
    await connect_db()
    await create_all_indexes()
    yield
    # Shutdown
    logger.info(f"Shutting down {settings.APP_NAME}...")
    await close_db()


app = FastAPI(
    title="SciRAG API — Intelligent Research Assistant",
    description="Backend API for Scientific Literature Retrieval-Augmented Generation (Retrieval • Generation • Citation-Grounded Answers).",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Security and Observability Middleware
app.add_middleware(SecurityAndObservabilityMiddleware)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Centralized Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    req_id = getattr(request.state, "request_id", "unknown")
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc} [req:{req_id}]")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred processing your scientific request.",
                "request_id": req_id
            }
        }
    )

# Mount all route modules under /api/v1
api_v1_prefix = settings.API_PREFIX

app.include_router(health.router, prefix=api_v1_prefix)
app.include_router(auth.router, prefix=api_v1_prefix)
app.include_router(users.router, prefix=api_v1_prefix)
app.include_router(papers.router, prefix=api_v1_prefix)
app.include_router(uploads.router, prefix=api_v1_prefix)
app.include_router(search.router, prefix=api_v1_prefix)
app.include_router(retrieval.router, prefix=api_v1_prefix)
app.include_router(chat.router, prefix=api_v1_prefix)
app.include_router(citations.router, prefix=api_v1_prefix)
app.include_router(collections.router, prefix=api_v1_prefix)
app.include_router(summaries.router, prefix=api_v1_prefix)
app.include_router(compare.router, prefix=api_v1_prefix)
app.include_router(research.router, prefix=api_v1_prefix)
app.include_router(insights.router, prefix=api_v1_prefix)
app.include_router(evaluation.router, prefix=api_v1_prefix)


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": "1.0.0",
        "tagline": "Retrieval • Generation • Citation-Grounded Answers",
        "docs": "/docs",
        "api_v1": settings.API_PREFIX
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
