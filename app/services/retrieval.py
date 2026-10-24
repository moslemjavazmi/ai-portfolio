from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.entities import KnowledgeDocument


def _tokens(query: str) -> list[str]:
    # Small lexical retrieval for the MVP. Replace with PostgreSQL full-text search/pgvector as corpus grows.
    cleaned = "".join(ch.lower() if ch.isalnum() else " " for ch in query)
    return [word for word in cleaned.split() if len(word) > 2][:12]


async def retrieve_documents(db: AsyncSession, question: str, limit: int = 5) -> list[KnowledgeDocument]:
    tokens = _tokens(question)
    base = select(KnowledgeDocument).where(KnowledgeDocument.is_published.is_(True))
    if not tokens:
        return list((await db.scalars(base.order_by(KnowledgeDocument.updated_at.desc()).limit(limit))).all())
    conditions = [KnowledgeDocument.title.ilike(f"%{token}%") | KnowledgeDocument.content.ilike(f"%{token}%") for token in tokens]
    stmt = base.where(or_(*conditions)).limit(limit)
    docs = list((await db.scalars(stmt)).all())
    if docs:
        return docs
    # Fall back to a few documents, so general questions still have grounded context.
    return list((await db.scalars(base.order_by(KnowledgeDocument.updated_at.desc()).limit(min(3, limit)))).all())
