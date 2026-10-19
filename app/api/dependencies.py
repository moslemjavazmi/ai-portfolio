from fastapi import Depends, HTTPException
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.repositories.user_repository import (
    UserRepository,
)


bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),
    db: AsyncSession = Depends(get_db),
):

    token = credentials.credentials

    try:

        payload = decode_access_token(token)

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token",
        )

    if payload.get("type") != "access":

        raise HTTPException(
            status_code=401,
            detail="Invalid token type",
        )

    user_id = payload.get("sub")

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    users = UserRepository(db)

    user = await users.get_by_id(
        user_id
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user