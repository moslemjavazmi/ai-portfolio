from fastapi import (
    APIRouter,
    Depends,
    Request,
    Response,
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
from app.api.dependencies import get_current_user
from app.models.users import User

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

        path="/auth",
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
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "email_verified": (
            user.email_verified_at is not None
        ),
    }