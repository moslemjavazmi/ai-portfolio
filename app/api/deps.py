
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.users import User
from app.repositories.user_repository import UserRepository


bearer_scheme = HTTPBearer(auto_error=False)


def unauthorized() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    # 1. Ensure the Authorization header contains a Bearer token.
    if credentials is None:
        raise unauthorized()

    # 2. Decode and validate the access token.
    try:
        payload = decode_access_token(credentials.credentials)
    except Exception:
        raise unauthorized() from None

    if not isinstance(payload, dict):
        raise unauthorized()

    # 3. Accept only access tokens, not refresh tokens.
    if payload.get("type") != "access":
        raise unauthorized()

    # 4. Validate the user ID contained in the token.
    subject = payload.get("sub")

    try:
        user_id = UUID(str(subject))
    except (ValueError, TypeError, AttributeError):
        raise unauthorized() from None

    # 5. Load the user from the database.
    users = UserRepository(db)
    user = await users.get_by_id(user_id)

    if user is None:
        raise unauthorized()

    return user



async def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    if credentials is None:
        return None

    try:
        payload = decode_access_token(credentials.credentials)

        if not isinstance(payload, dict):
            return None

        if payload.get("type") != "access":
            return None

        user_id = UUID(str(payload.get("sub")))
    except (Exception):
        return None

    users = UserRepository(db)
    return await users.get_by_id(user_id)




async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


