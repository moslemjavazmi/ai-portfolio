
import hashlib
import secrets

from fastapi import Request, Response

from app.core.config import settings


def hash_guest_token(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


def get_or_create_guest_token(
    request: Request,
    response: Response,
) -> str:
    token = request.cookies.get(
        settings.GUEST_COOKIE_NAME
    )

    if not token or len(token) > 200:
        token = secrets.token_urlsafe(32)

        response.set_cookie(
            key=settings.GUEST_COOKIE_NAME,
            value=token,
            max_age=settings.GUEST_COOKIE_MAX_AGE_SECONDS,
            httponly=True,
            secure=settings.GUEST_COOKIE_SECURE,
            samesite="lax",
            path="/",
        )

    return token
