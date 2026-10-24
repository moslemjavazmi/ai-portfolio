import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_admin
from app.core.database import get_db
from app.models.entities import KnowledgeDocument, SuggestedQuestion
from app.schemas.chat import (
    KnowledgeDocumentCreate, KnowledgeDocumentUpdate, KnowledgeDocumentOut,
    SuggestedQuestionCreate, SuggestedQuestionUpdate,
)

router = APIRouter(prefix="/api/admin", tags=["admin-knowledge"], dependencies=[Depends(get_current_admin)])


@router.get("/knowledge", response_model=list[KnowledgeDocumentOut])
async def list_knowledge(db: AsyncSession = Depends(get_db)):
    return list((await db.scalars(select(KnowledgeDocument).order_by(KnowledgeDocument.updated_at.desc()))).all())


@router.post("/knowledge", response_model=KnowledgeDocumentOut, status_code=status.HTTP_201_CREATED)
async def create_knowledge(payload: KnowledgeDocumentCreate, db: AsyncSession = Depends(get_db)):
    item = KnowledgeDocument(**payload.model_dump())
    db.add(item)
    try:
        await db.commit()
        await db.refresh(item)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="A document with this slug already exists") from exc
    return item


@router.patch("/knowledge/{document_id}", response_model=KnowledgeDocumentOut)
async def update_knowledge(document_id: uuid.UUID, payload: KnowledgeDocumentUpdate, db: AsyncSession = Depends(get_db)):
    item = await db.get(KnowledgeDocument, document_id)
    if not item:
        raise HTTPException(status_code=404, detail="Document not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/knowledge/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_knowledge(document_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    item = await db.get(KnowledgeDocument, document_id)
    if not item:
        raise HTTPException(status_code=404, detail="Document not found")
    await db.delete(item)
    await db.commit()


@router.get("/questions")
async def list_admin_questions(db: AsyncSession = Depends(get_db)):
    rows = list((await db.scalars(select(SuggestedQuestion).order_by(SuggestedQuestion.sort_order.asc()))).all())
    return [{"id": str(r.id), "question": r.question, "category": r.category, "sort_order": r.sort_order, "is_active": r.is_active} for r in rows]


@router.post("/questions", status_code=status.HTTP_201_CREATED)
async def create_question(payload: SuggestedQuestionCreate, db: AsyncSession = Depends(get_db)):
    item = SuggestedQuestion(**payload.model_dump())
    db.add(item)
    try:
        await db.commit()
        await db.refresh(item)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="This question already exists") from exc
    return {"id": str(item.id), "question": item.question, "category": item.category, "sort_order": item.sort_order, "is_active": item.is_active}


@router.patch("/questions/{question_id}")
async def update_question(question_id: uuid.UUID, payload: SuggestedQuestionUpdate, db: AsyncSession = Depends(get_db)):
    item = await db.get(SuggestedQuestion, question_id)
    if not item:
        raise HTTPException(status_code=404, detail="Question not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return {"id": str(item.id), "question": item.question, "category": item.category, "sort_order": item.sort_order, "is_active": item.is_active}


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_question(question_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    item = await db.get(SuggestedQuestion, question_id)
    if not item:
        raise HTTPException(status_code=404, detail="Question not found")
    await db.delete(item)
    await db.commit()
