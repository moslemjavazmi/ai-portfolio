import asyncio

from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models.entities import KnowledgeDocument, SuggestedQuestion


DOCUMENTS = [
    {
        "slug": "taskino-overview",
        "title": "Taskino — Project Overview",
        "content": """
Taskino is a task marketplace project designed to connect customers
who need services with taskers who can perform those services.

The planned user journey includes creating a task, administrative
approval, matching relevant taskers, receiving offers, selecting an
offer, accepting the task, starting the work, and completing it.

The project is being developed as a portfolio project. Do not claim
that every planned feature is already production-ready or deployed.
When asked about implementation status, distinguish implemented
features from planned or unfinished work.
""".strip(),
    },
    {
        "slug": "taskino-architecture",
        "title": "Taskino — Backend Architecture",
        "content": """
The planned Taskino architecture uses TypeScript and Node.js with
Express-based backend services. PostgreSQL and Prisma are used for
relational data in the relevant services. Kafka is used for
event-driven communication, and MongoDB is used for the chat service.

The frontend is planned with Next.js, TypeScript, and Tailwind CSS.
The architecture also includes an API Gateway and separate services
for authentication, users, tasks, offers, search, and reviews.

These statements describe the project's architecture and implementation
direction. Do not assume every service is complete, deployed, or
operating at production scale.
""".strip(),
    },
    {
        "slug": "taskino-auth-and-workflow",
        "title": "Taskino — Authentication and Task Workflow",
        "content": """
The authentication design includes JWT-based access tokens,
refresh-token sessions, email verification, and trusted-device or
additional authentication capabilities.

The task workflow includes task creation, approval, tasker offers,
customer selection, tasker acceptance, work execution, and completion.

Some workflow and payment/chat components may still be under
development. Explain only what is supported by the available project
information and avoid inventing performance figures or production users.
""".strip(),
    },
    {
        "slug": "developer-skills",
        "title": "Technical Skills",
        "content": """
The portfolio owner's current technical areas include JavaScript,
TypeScript, Node.js, Express, React, Next.js, PostgreSQL, MongoDB,
Prisma, Kafka, Socket.IO, Docker, Python, FastAPI, and LangGraph.

The owner is also learning AI engineering and agent-based application
development. Explain the skills in relation to the projects and
learning work described in this knowledge base.

Do not invent employers, job titles, professional employment history,
certifications, measurable business results, or years of experience.
If a detail is not available, say so.
""".strip(),
    },
    {
        "slug": "portfolio-ai-assistant",
        "title": "AI Portfolio Assistant",
        "content": """
The portfolio includes an AI assistant built with a Next.js frontend
and a FastAPI backend. The backend uses PostgreSQL to store knowledge
documents, conversations, chat messages, and suggested questions.
LangGraph is used to orchestrate the assistant workflow, and an
OpenRouter-compatible model provider is configured for language-model
requests.

The retrieval workflow searches published knowledge documents and
provides relevant context to the language model. The assistant should
use this context to answer questions about the portfolio and its
projects.

The assistant must not fabricate personal facts or project details.
If the knowledge base does not contain an answer, it should say that
the available information is insufficient.
""".strip(),
    },
]


QUESTIONS = [
    {
        "question": "What is Taskino and what problem does it solve?",
        "category": "projects",
        "sort_order": 1,
    },
    {
        "question": "How is Taskino's backend architecture designed?",
        "category": "architecture",
        "sort_order": 2,
    },
    {
        "question": "Which technologies are used in Taskino?",
        "category": "technology",
        "sort_order": 3,
    },
    {
        "question": "How does the task and offer workflow work?",
        "category": "architecture",
        "sort_order": 4,
    },
    {
        "question": "What is the AI portfolio assistant built with?",
        "category": "ai",
        "sort_order": 5,
    },
]


async def seed_knowledge() -> None:
    async with AsyncSessionLocal() as db:
        try:
            for item in DOCUMENTS:
                result = await db.execute(
                    select(KnowledgeDocument).where(
                        KnowledgeDocument.slug == item["slug"]
                    )
                )
                document = result.scalar_one_or_none()

                if document is None:
                    document = KnowledgeDocument(**item)
                    db.add(document)
                else:
                    document.title = item["title"]
                    document.content = item["content"]
                    document.is_published = True

            for item in QUESTIONS:
                result = await db.execute(
                    select(SuggestedQuestion).where(
                        SuggestedQuestion.question == item["question"]
                    )
                )
                question = result.scalar_one_or_none()

                if question is None:
                    question = SuggestedQuestion(
                        **item,
                        is_active=True,
                    )
                    db.add(question)
                else:
                    question.category = item["category"]
                    question.sort_order = item["sort_order"]
                    question.is_active = True

            await db.commit()
            print(
                f"Seed completed: {len(DOCUMENTS)} knowledge documents "
                f"and {len(QUESTIONS)} suggested questions processed."
            )

        except Exception:
            await db.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(seed_knowledge())