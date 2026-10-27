
import re

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entities import KnowledgeDocument


STOP_WORDS = {
    "the", "and", "for", "with", "that", "this", "what", "when",
    "where", "which", "who", "how", "why", "are", "was", "were",
    "have", "has", "had", "you", "your", "from", "into", "about",
    "could", "would", "should", "will", "can", "not", "but", "then",
    "than", "their", "they", "them", "our", "its", "next", "some",
    "any", "all", "does", "did", "been", "being", "much", "many",
    "more", "most", "also", "only", "currently", "future",
    "iteration", "iterations", "improve", "improvements",
    "به", "از", "در", "را", "که", "چه", "چطور", "چگونه", "برای",
    "با", "این", "آن", "و", "یا", "است", "هست", "می", "شود",
}


def _tokens(text: str) -> list[str]:
    words = re.findall(r"[^\W_]+", text.lower(), flags=re.UNICODE)

    return [
        word
        for word in words
        if len(word) > 2 and word not in STOP_WORDS
    ][:30]


def _score_document(
    question_tokens: set[str],
    document: KnowledgeDocument,
) -> int:
    title_tokens = set(_tokens(document.title))
    slug_tokens = set(_tokens(document.slug.replace("-", " ")))
    content_tokens = set(_tokens(document.content))

    title_matches = question_tokens & title_tokens
    slug_matches = question_tokens & slug_tokens
    content_matches = question_tokens & content_tokens

    # Titles and slugs are stronger signals than body text.
    score = (
        len(title_matches) * 4
        + len(slug_matches) * 3
        + len(content_matches)
    )

    # Reward documents that cover several distinct query terms.
    matched_terms = title_matches | slug_matches | content_matches
    if len(question_tokens) > 0:
        coverage = len(matched_terms) / len(question_tokens)
        score += int(coverage * 4)

    return score


async def retrieve_documents(
    db: AsyncSession,
    question: str,
    limit: int = 4,
) -> list[KnowledgeDocument]:
    question_tokens = set(_tokens(question))

    if not question_tokens:
        return []

    statement = select(KnowledgeDocument).where(
        KnowledgeDocument.is_published.is_(True)
    )

    result = await db.scalars(statement)
    documents = list(result.all())

    ranked = [
        (_score_document(question_tokens, document), document)
        for document in documents
    ]

    # Remove documents with no meaningful lexical overlap.
    ranked = [
        item for item in ranked
        if item[0] >= 2
    ]

    ranked.sort(key=lambda item: item[0], reverse=True)

    return [
        document
        for _, document in ranked[:limit]
    ]
