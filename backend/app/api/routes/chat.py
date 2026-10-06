import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List
from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatResponseData,
    CreateConversationRequest
)
from app.rag.pipeline import run_rag
from app.rag.agentic_research import run_controlled_deep_research
from app.rag.context_builder import build_evidence_context
from app.rag.prompts import SYSTEM_RAG_PROMPT
from app.retrieval.hybrid import hybrid_retrieve
from app.services.grok_service import grok_service
from app.db.mongodb import get_database
from app.utils.ids import generate_conversation_id, generate_message_id

router = APIRouter(prefix="/chat", tags=["Research Copilot & Chat"])


@router.post("", response_model=ChatResponse)
async def ask_copilot(
    req: ChatRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Execute evidence-grounded research synthesis.
    Supports Grounded Mode and Controlled Deep Research Mode.
    """
    conversation_id = req.conversation_id or generate_conversation_id()
    db = get_database()

    # Deep research branch if specified
    if req.research_mode == "deep_research":
        deep_res = await run_controlled_deep_research(
            query=req.message,
            owner_id=current_user.id,
            paper_ids=req.paper_ids
        )
        response_data = ChatResponseData(
            answer=deep_res["final_answer"],
            citations=deep_res["citations"],
            sources=[],
            retrieval={"mode": "deep_research", "iterations": len(deep_res["steps"])},
            latency_ms=1450.0,
            conversation_id=conversation_id
        )
    else:
        # Standard Grounded RAG Pipeline
        rag_res = await run_rag(
            query=req.message,
            owner_id=current_user.id,
            paper_ids=req.paper_ids,
            collection_id=req.collection_id,
            retrieval_mode=req.retrieval_mode
        )
        response_data = ChatResponseData(
            answer=rag_res["answer"],
            citations=rag_res["citations"],
            sources=rag_res["sources"],
            retrieval=rag_res["retrieval"],
            latency_ms=rag_res["latency_ms"],
            conversation_id=conversation_id
        )

    # Persist message history if DB is active
    if db is not None:
        now = datetime.now(timezone.utc)
        # Store user query message
        await db.messages.insert_one({
            "_id": generate_message_id(),
            "conversation_id": conversation_id,
            "user_id": current_user.id,
            "role": "user",
            "content": req.message,
            "citations": [],
            "retrieved_chunk_ids": [],
            "created_at": now
        })
        # Store assistant response message
        await db.messages.insert_one({
            "_id": generate_message_id(),
            "conversation_id": conversation_id,
            "user_id": current_user.id,
            "role": "assistant",
            "content": response_data.answer,
            "citations": [c.model_dump() if hasattr(c, "model_dump") else c for c in response_data.citations],
            "retrieved_chunk_ids": [s.get("chunk_id") for s in response_data.sources if isinstance(s, dict)],
            "created_at": now
        })
        # Upsert conversation record
        await db.conversations.update_one(
            {"_id": conversation_id},
            {
                "$set": {
                    "user_id": current_user.id,
                    "updated_at": now,
                    "scope_paper_ids": req.paper_ids or []
                },
                "$setOnInsert": {
                    "title": req.message[:50],
                    "created_at": now
                }
            },
            upsert=True
        )

    return ChatResponse(success=True, data=response_data)


@router.post("/stream")
async def stream_copilot(
    req: ChatRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Server-Sent Events (SSE) streaming answer synthesis from Grok.
    """
    candidates = await hybrid_retrieve(
        query=req.message,
        owner_id=current_user.id,
        paper_ids=req.paper_ids,
        top_k=5
    )
    formatted_context, _ = build_evidence_context(candidates)

    async def sse_event_stream():
        async for chunk in grok_service.stream_answer(
            system_prompt=SYSTEM_RAG_PROMPT,
            user_query=req.message,
            formatted_context=formatted_context
        ):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(sse_event_stream(), media_type="text/event-stream")


@router.get("/conversations")
async def list_conversations(current_user: UserModel = Depends(get_current_user)):
    """Retrieve researcher's historical chat sessions."""
    db = get_database()
    if db is not None:
        cursor = db.conversations.find({"user_id": current_user.id}).sort("updated_at", -1)
        return await cursor.to_list(length=30)
    return []


@router.get("/conversations/{conversation_id}")
async def get_conversation_messages(
    conversation_id: str,
    current_user: UserModel = Depends(get_current_user)
):
    """Retrieve full message history for a conversation."""
    db = get_database()
    if db is not None:
        cursor = db.messages.find({
            "conversation_id": conversation_id,
            "user_id": current_user.id
        }).sort("created_at", 1)
        return await cursor.to_list(length=100)
    return []


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: UserModel = Depends(get_current_user)
):
    db = get_database()
    if db is not None:
        await db.conversations.delete_one({"_id": conversation_id, "user_id": current_user.id})
        await db.messages.delete_many({"conversation_id": conversation_id, "user_id": current_user.id})
    return {"success": True, "message": "Conversation deleted."}
