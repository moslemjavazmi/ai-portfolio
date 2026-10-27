from uuid import UUID
from sqlalchemy import select
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    create_access_token,
    generate_secure_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.models.email_verification import (
    EmailVerificationToken,
)
from app.models.users import User
from app.repositories.user_repository import UserRepository
from app.repositories.verification_repository import (
    VerificationRepository,
)
from app.services.email_service import EmailService

from app.models.session import Session
from app.repositories.session_repository import SessionRepository

class AuthService:

    def __init__(self, db: AsyncSession):

        self.db = db

        self.users = UserRepository(db)

        self.verifications = (
            VerificationRepository(db)
        )
        self.sessions = SessionRepository(db)
        self.email_service = EmailService()

    async def register(
        self,
        name: str,
        email: str,
        password: str,
    ):

        email = email.strip().lower()

        existing_user = (
            await self.users.get_by_email(email)
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        user = await self.users.create(
            name=name.strip(),
            email=email,
            password_hash=hash_password(password),
        )

        # await self.users.create(user)

        raw_token = generate_secure_token()

        verification = EmailVerificationToken(
            user_id=user.id,
            token_hash=hash_token(raw_token),
            expires_at=(
                datetime.now(timezone.utc)
                + timedelta(
                    minutes=settings
                    .EMAIL_VERIFICATION_EXPIRE_MINUTES
                )
            ),
        )

        # await self.verifications.create(
        #     verification
        # )

        # await self.email_service.send_verification_email(
        #     email=email,
        #     token=raw_token,
        # )

        # await self.db.commit()

        await self.verifications.create(verification)
        await self.db.commit()

        await self.email_service.send_verification_email(
            email=email,
            token=raw_token,
)
        return {
            "message": (
                "Registration successful. "
                "Please verify your email."
            )
        }

    async def verify_email(
        self,
        token: str,
    ):

        verification = (
            await self.verifications.get_valid_token(
                hash_token(token)
            )
        )

        if not verification:
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired verification token",
            )

        user = await self.users.get_by_id(
            verification.user_id
        )

        if not user:
            raise HTTPException(
                status_code=400,
                detail="User not found",
            )

        user.email_verified_at = (
            datetime.now(timezone.utc)
        )

        verification.used_at = (
            datetime.now(timezone.utc)
        )

        await self.db.commit()

        return {
            "message": "Email verified successfully"
        }
    async def login(
        self,
        email: str,
        password: str,
        ip_address: str | None,
        user_agent: str | None,
        ):

        email = email.strip().lower()

        user = await self.users.get_by_email(email)

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        if user.email_verified_at is None:
            raise HTTPException(
                status_code=403,
                detail="Email is not verified",
            )

        refresh_token = generate_secure_token()

        session = Session(
            user_id=user.id,
            refresh_token_hash=hash_token(
                refresh_token
            ),
            expires_at=(
                datetime.now(timezone.utc)
                + timedelta(
                    days=settings.REFRESH_TOKEN_EXPIRE_DAYS
                )
            ),
            ip_address=ip_address,
            user_agent=user_agent,
        )

        await self.sessions.create(session)

        await self.db.commit()

        access_token = create_access_token(
            user.id
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": self.serialize_user(user),
        }
    
    def serialize_user(self, user):
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "email_verified": (
                user.email_verified_at is not None
            ),
            "role": user.role,
        }
    
    @staticmethod
    def _utc(value: datetime) -> datetime:
        # Some database drivers return naive datetimes
        # even when the column is timezone-aware.
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)

    async def refresh(
        self,
        refresh_token: str,
        ip_address: str | None,
        user_agent: str | None,
    ) -> dict:
        now = datetime.now(timezone.utc)
        token_hash = hash_token(refresh_token)

        session = await self.sessions.get_by_refresh_hash(token_hash)

        if session is None or session.revoked_at is not None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        if self._utc(session.expires_at) <= now:
            await self.sessions.revoke(session)
            await self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired",
            )

        user = await self.users.get_by_id(session.user_id)

        if user is None:
            await self.sessions.revoke(session)
            await self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        # Rotate the refresh token: revoke the old session.
        await self.sessions.revoke(session)

        new_refresh_token = generate_secure_token()
        new_session = Session(
            user_id=user.id,
            refresh_token_hash=hash_token(new_refresh_token),
            expires_at=now + timedelta(
                days=settings.REFRESH_TOKEN_EXPIRE_DAYS
            ),
            ip_address=ip_address,
            user_agent=user_agent,
        )

        await self.sessions.create(new_session)
        await self.sessions.update_last_used(new_session)

        access_token = create_access_token(user.id)

        await self.db.commit()

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "user": self.serialize_user(user),
        }

    async def logout(
        self,
        user_id: UUID,
        refresh_token: str | None,
    ) -> None:
        if not refresh_token:
            return

        token_hash = hash_token(refresh_token)
        session = await self.sessions.get_by_refresh_hash(token_hash)

        # فقط نشست متعلق به همین کاربر را باطل می‌کنیم.
        if session is not None and session.user_id == user_id:
            await self.sessions.revoke(session)

        await self.db.commit()


    async def logout_all(self, user_id: UUID) -> int:
        count = await self.sessions.revoke_all_for_user(user_id)
        await self.db.commit()
        return count


    async def list_active_sessions(self, user_id: UUID) -> list[dict]:
        sessions = await self.sessions.get_active_for_user(user_id)

        return [
            {
                "id": str(session.id),
                "created_at": session.created_at,
                "expires_at": session.expires_at,
                "last_used_at": session.last_used_at,
                "ip_address": session.ip_address,
                "user_agent": session.user_agent,
            }
            for session in sessions
        ]
