
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entities import Conversation


class ConversationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_owned_by_guest(
        self,
        conversation_id: UUID,
        guest_token_hash: str,
    ) -> Conversation | None:
        result = await self.db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.guest_token_hash == guest_token_hash,
                Conversation.user_id.is_(None),
            )
        )
        return result.scalar_one_or_none()

    async def list_for_guest(
        self,
        guest_token_hash: str,
        limit: int = 50,
    ) -> list[Conversation]:
        result = await self.db.execute(
            select(Conversation)
            .where(
                Conversation.guest_token_hash == guest_token_hash,
                Conversation.user_id.is_(None),
            )
            .order_by(Conversation.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_owned_by_user(
        self,
        conversation_id: UUID,
        user_id: UUID,
    ) -> Conversation | None:
        result = await self.db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_for_user(
        self,
        user_id: UUID,
        limit: int = 50,
    ) -> list[Conversation]:
        result = await self.db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def claim_guest_conversations(
        self,
        guest_token_hash: str,
        user_id: UUID,
    ) -> int:
        result = await self.db.execute(
            select(Conversation).where(
                Conversation.guest_token_hash == guest_token_hash,
                Conversation.user_id.is_(None),
            )
        )
        conversations = list(result.scalars().all())

        for conversation in conversations:
            conversation.user_id = user_id

        await self.db.flush()
        return len(conversations)
