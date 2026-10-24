import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.models.entities import ChatMessage, Conversation, SuggestedQuestion
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.agent import agent_graph
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["public-ai"])


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/questions")
async def get_suggested_questions(db: AsyncSession = Depends(get_db)):
    rows = list((await db.scalars(
        select(SuggestedQuestion)
        .where(SuggestedQuestion.is_active.is_(True))
        .order_by(SuggestedQuestion.sort_order.asc(), SuggestedQuestion.question.asc())
        .limit(30)
    )).all())
    return [{"id": str(row.id), "question": row.question, "category": row.category} for row in rows]


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, db: AsyncSession = Depends(get_db)):
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=422, detail="Question cannot be empty")
    if len(question) > settings.MAX_QUESTION_CHARS:
        raise HTTPException(
            status_code=413,
            detail="Question is too long",
        )

    conversation: Conversation | None = None
    if payload.conversation_id:
        conversation = await db.get(Conversation, payload.conversation_id)
    if conversation is None:
        conversation = Conversation()
        db.add(conversation)
        await db.flush()

    previous = list((await db.scalars(
        select(ChatMessage)
        .where(ChatMessage.conversation_id == conversation.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(8)
    )).all())
    previous.reverse()
    history = [{"role": item.role, "content": item.content} for item in previous]

    user_message = ChatMessage(conversation_id=conversation.id, role="user", content=question)
    db.add(user_message)
    await db.flush()

    try:
        result = await agent_graph.ainvoke({
            "question": question,
            "language": payload.language,
            "history": history,
            "db": db,
        })
        answer = str(result.get("answer", "I could not generate an answer right now."))
        suggestions = result.get("suggested_questions", [])
        sources = result.get("sources", [])
        db.add(ChatMessage(conversation_id=conversation.id, role="assistant", content=answer))
        await db.commit()
        return ChatResponse(
            conversation_id=conversation.id,
            answer=answer,
            suggested_questions=suggestions,
            sources=sources,
        )
    except Exception as exc:
        logger.exception("Chat endpoint failed")
        await db.rollback()
        # Do not leak provider or database details to public callers.
        raise HTTPException(status_code=502, detail="The assistant is temporarily unavailable. Please try again.") from exc
