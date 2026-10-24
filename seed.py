"""Seed initial portfolio knowledge and recruiter questions.
Run from repository root after configuring .env: python seed.py
"""
import asyncio
from pathlib import Path
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models import Base, KnowledgeDocument, SuggestedQuestion
from app.db.session import engine

ROOT = Path(__file__).parent
QUESTIONS = [
    ("What is Taskino and what problem does it solve?", "project", 1),
    ("Can you explain Taskino's overall architecture?", "architecture", 2),
    ("Why did you use Kafka in Taskino?", "backend", 3),
    ("Why does Taskino use PostgreSQL and MongoDB?", "database", 4),
    ("Which parts of Taskino did you personally implement?", "ownership", 5),
    ("How is the payment service designed?", "backend", 6),
    ("What are your strongest backend technologies?", "skills", 7),
    ("What would you improve before scaling Taskino?", "architecture", 8),
]

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as db:
        for path in (ROOT / "knowledge").glob("*.md"):
            slug = path.stem.lower().replace("_", "-")
            existing = await db.scalar(select(KnowledgeDocument).where(KnowledgeDocument.slug == slug))
            if existing:
                continue
            title = path.stem.replace("-", " ").replace("_", " ").title()
            db.add(KnowledgeDocument(slug=slug, title=title, content=path.read_text(encoding="utf-8"), is_published=True))
        for question, category, order in QUESTIONS:
            existing = await db.scalar(select(SuggestedQuestion).where(SuggestedQuestion.question == question))
            if not existing:
                db.add(SuggestedQuestion(question=question, category=category, sort_order=order, is_active=True))
        await db.commit()
    print("Seed completed.")

if __name__ == "__main__":
    asyncio.run(main())
