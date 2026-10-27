from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.session import Session


class SessionRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        session: Session,
    ) -> Session:

        self.db.add(session)

        await self.db.flush()

        return session


    async def get_by_refresh_hash(
        self,
        refresh_token_hash: str,
    ) -> Session | None:
        result = await self.db.execute(
            select(Session)
            .where(Session.refresh_token_hash == refresh_token_hash)
            .with_for_update()
        )
        return result.scalar_one_or_none()


    async def revoke(
        self,
        session: Session,
    ) -> None:

        session.revoked_at = (
            datetime.now(timezone.utc)
        )

    async def update_last_used(
        self,
        session: Session,
    ) -> None:

        session.last_used_at = (
            datetime.now(timezone.utc)
        )

    async def get_active_for_user(self, user_id: UUID) -> list[Session]:
        now = datetime.now(timezone.utc)

        result = await self.db.execute(
            select(Session)
            .where(
                Session.user_id == user_id,
                Session.revoked_at.is_(None),
                Session.expires_at > now,
            )
            .order_by(Session.created_at.desc())
        )

        return list(result.scalars().all())


    async def revoke_all_for_user(self, user_id: UUID) -> int:
        result = await self.db.execute(
            select(Session).where(
                Session.user_id == user_id,
                Session.revoked_at.is_(None),
            )
        )

        sessions = list(result.scalars().all())
        now = datetime.now(timezone.utc)

        for session in sessions:
            session.revoked_at = now

        return len(sessions)