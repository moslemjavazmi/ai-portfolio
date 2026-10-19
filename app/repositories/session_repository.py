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
            select(Session).where(
                Session.refresh_token_hash
                == refresh_token_hash
            )
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