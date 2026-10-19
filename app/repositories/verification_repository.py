from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.email_verification import (
    EmailVerificationToken,
)


class VerificationRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        verification: EmailVerificationToken,
    ):
        self.db.add(verification)

        await self.db.flush()

        return verification

    async def get_valid_token(
        self,
        token_hash: str,
    ):
        now = datetime.now(timezone.utc)

        result = await self.db.execute(
            select(EmailVerificationToken)
            .where(
                EmailVerificationToken.token_hash
                == token_hash,

                EmailVerificationToken.used_at
                .is_(None),

                EmailVerificationToken.expires_at
                > now,
            )
        )

        return result.scalar_one_or_none()