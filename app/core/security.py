import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

import jwt
from pwdlib import PasswordHash

from app.core.config import settings


password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        password,
        hashed_password,
    )


def generate_secure_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


def create_access_token(
    user_id: UUID,
) -> str:

    now = datetime.now(timezone.utc)

    expire = (
        now
        + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),

        "type": "access",

        "iat": now,

        "exp": expire,

        "iss": settings.JWT_ISSUER,

        "aud": settings.JWT_AUDIENCE,
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(
    token: str,
) -> dict:

    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[
            settings.JWT_ALGORITHM
        ],
        audience=settings.JWT_AUDIENCE,
        issuer=settings.JWT_ISSUER,
    )