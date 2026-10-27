import uuid
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.models.entities import ChatMessage, Conversation, SuggestedQuestion
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.agent import agent_graph
import logging

from app.api.deps import get_optional_current_user
from app.core.guest import (
    get_or_create_guest_token,
    hash_guest_token,
)
from app.repositories.conversation_repository import ConversationRepository
from app.models.users import User

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
async def chat(
    payload: ChatRequest,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=422, detail="Question cannot be empty")
    if len(question) > settings.MAX_QUESTION_CHARS:
        raise HTTPException(
            status_code=413,
            detail="Question is too long",
        )
    repository = ConversationRepository(db)
    guest_hash = None

    if current_user is None:
        guest_token = get_or_create_guest_token(request, response)
        guest_hash = hash_guest_token(guest_token)

    conversation = None

    if payload.conversation_id:
        if current_user is not None:
            conversation = await repository.get_owned_by_user(
                payload.conversation_id,
                current_user.id,
            )
        else:
            conversation = await repository.get_owned_by_guest(
                payload.conversation_id,
                guest_hash,
            )

        if conversation is None:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found",
            )
    else:
        if current_user is not None:
            conversation = Conversation(
                user_id=current_user.id,
                guest_token_hash=None,
            )
        else:
            conversation = Conversation(
                user_id=None,
                guest_token_hash=guest_hash,
            )

        db.add(conversation)
        await db.flush()

    previous = list(
        (
            await db.scalars(
                select(ChatMessage)
                .where(
                    ChatMessage.conversation_id == conversation.id
                )
                .order_by(ChatMessage.created_at.desc())
                .limit(8)
            )
        ).all()
    )
    previous.reverse()

    history = [
        {"role": item.role, "content": item.content}
        for item in previous
    ]

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




@router.get("/conversations")
async def list_conversations(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    repository = ConversationRepository(db)

    if current_user is not None:
        conversations = await repository.list_for_user(
            current_user.id
        )
    else:
        token = get_or_create_guest_token(request, response)
        conversations = await repository.list_for_guest(
            hash_guest_token(token)
        )

    return {
        "conversations": [
            {
                "id": str(item.id),
                "created_at": item.created_at,
            }
            for item in conversations
        ]
    }


@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: UUID,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    repository = ConversationRepository(db)
    logger.info(
    "Conversation restore: id=%s, authenticated=%s, user_id=%s",
    conversation_id,
    current_user is not None,
    str(current_user.id) if current_user else None,
)
    if current_user is not None:
        conversation = await repository.get_owned_by_user(
            conversation_id,
            current_user.id,
        )
        logger.info(
            "Conversation owned by authenticated user: %s",
            conversation is not None,
        )
    else:
        token = get_or_create_guest_token(request, response)
        conversation = await repository.get_owned_by_guest(
            conversation_id,
            hash_guest_token(token),
        )

    if conversation is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    result = await db.scalars(
        select(ChatMessage)
        .where(ChatMessage.conversation_id == conversation.id)
        .order_by(ChatMessage.created_at.asc())
    )

    messages = list(result.all())

    return {
        "conversation_id": str(conversation.id),
        "messages": [
            {
                "id": str(message.id),
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at,
            }
            for message in messages
        ],
    }