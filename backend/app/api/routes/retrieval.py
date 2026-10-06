from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.retrieval import RetrievalRequest, RerankRequest
from app.retrieval.dense import dense_retrieve
from app.retrieval.bm25 import bm25_retrieve
from app.retrieval.hybrid import hybrid_retrieve
from app.retrieval.reranker import reranker

router = APIRouter(prefix="/retrieval", tags=["Retrieval"])


@router.post("/dense")
async def retrieval_dense(req: RetrievalRequest, current_user: UserModel = Depends(get_current_user)):
    return await dense_retrieve(
        query=req.query,
        owner_id=current_user.id,
        paper_ids=req.paper_ids,
        top_k=req.top_k
    )


@router.post("/bm25")
async def retrieval_bm25(req: RetrievalRequest, current_user: UserModel = Depends(get_current_user)):
    return await bm25_retrieve(
        query=req.query,
        owner_id=current_user.id,
        paper_ids=req.paper_ids,
        top_k=req.top_k
    )


@router.post("/hybrid")
async def retrieval_hybrid(req: RetrievalRequest, current_user: UserModel = Depends(get_current_user)):
    return await hybrid_retrieve(
        query=req.query,
        owner_id=current_user.id,
        paper_ids=req.paper_ids,
        top_k=req.top_k,
        enable_rerank=True
    )


@router.post("/rerank")
async def retrieval_rerank(req: RerankRequest, current_user: UserModel = Depends(get_current_user)):
    return reranker.rerank(
        query=req.query,
        candidates=req.candidates,
        top_k=req.top_k
    )
