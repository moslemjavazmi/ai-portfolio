from uuid import UUID
from fastapi import (
    APIRouter,
    Depends,
    Request,
    Response,
    HTTPException
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
)
from app.services.auth_service import AuthService
from app.api.deps import get_current_user
from app.models.users import User

from app.core.guest import (
    hash_guest_token,
)
from app.repositories.conversation_repository import ConversationRepository
import logging

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=RegisterResponse,
)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):

    service = AuthService(db)

    return await service.register(
        name=data.name,
        email=data.email,
        password=data.password,
    )


@router.get("/verify-email")
async def verify_email(
    token: str,
    db: AsyncSession = Depends(get_db),
):

    service = AuthService(db)

    return await service.verify_email(token)

@router.post("/login")
async def login(
    data: LoginRequest,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):

    service = AuthService(db)

    result = await service.login(
        email=data.email,
        password=data.password,
        ip_address=(
            request.client.host
            if request.client
            else None
        ),
        user_agent=request.headers.get(
            "user-agent"
        ),
    )
    guest_token = request.cookies.get(settings.GUEST_COOKIE_NAME)

    logger.info(
        "Login guest cookie received: %s",
        guest_token is not None,
    )

    claimed_count = 0

    if guest_token:
        conversations = ConversationRepository(db)

        claimed_count = await conversations.claim_guest_conversations(
            guest_token_hash=hash_guest_token(guest_token),
            user_id=UUID(str(result["user"]["id"])),
        )

        await db.commit()

    logger.info("Guest conversations claimed: %s", claimed_count)
    
    response.set_cookie(
        key="refresh_token",

        value=result["refresh_token"],

        httponly=True,

        secure=False,  # production=True

        samesite="lax",

        max_age=(
            settings.REFRESH_TOKEN_EXPIRE_DAYS
            * 24
            * 60
            * 60
        ),

        path="/api/auth",
    )

    return {
        "access_token": result["access_token"],
        "token_type": "bearer",
        "user": result["user"],
    }

@router.get("/me")
async def me(
    user: User = Depends(get_current_user),
):

    return {
       "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "email_verified": user.email_verified_at is not None,
        "role": user.role,
    }



@router.post("/refresh")
async def refresh_access_token(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="Refresh token is missing",
        )

    service = AuthService(db)

    result = await service.refresh(
        refresh_token=refresh_token,
        ip_address=(
            request.client.host if request.client else None
        ),
        user_agent=request.headers.get("user-agent"),
    )

    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/api/auth",
    )

    return {
        "access_token": result["access_token"],
        "token_type": "bearer",
        "user": result["user"],
    }



@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AuthService(db)

    await service.logout(
        user_id=current_user.id,
        refresh_token=request.cookies.get("refresh_token"),
    )

    response.delete_cookie(
        key="refresh_token",
        path="/api/auth",
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite="lax",
    )

    return {"message": "Logged out successfully"}


@router.post("/logout-all")
async def logout_all(
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AuthService(db)
    revoked_count = await service.logout_all(current_user.id)

    response.delete_cookie(
        key="refresh_token",
        path="/api/auth",
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite="lax",
    )

    return {
        "message": "Logged out from all sessions",
        "revoked_sessions": revoked_count,
    }


@router.get("/sessions")
async def list_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AuthService(db)
    sessions = await service.list_active_sessions(current_user.id)

    return {"sessions": sessions}
