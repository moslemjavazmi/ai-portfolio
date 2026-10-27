# from pydantic_settings import BaseSettings, SettingsConfigDict
# from functools import lru_cache


# class Settings(BaseSettings):
#     APP_NAME: str = "Taskino Auth Service"

#     DATABASE_URL: str

#     JWT_SECRET_KEY: str
#     JWT_ALGORITHM: str = "HS256"
#     JWT_ISSUER: str = "taskino-auth"

#     JWT_AUDIENCE: str = "taskino-api"

#     ACCESS_TOKEN_EXPIRE_MINUTES: int = 10
#     REFRESH_TOKEN_EXPIRE_DAYS: int = 30

#     EMAIL_VERIFICATION_EXPIRE_MINUTES: int = 30

#     SMTP_HOST: str = "smtp.gmail.com"
#     SMTP_PORT: int = 587

#     SMTP_USERNAME: str = ""
#     SMTP_PASSWORD: str = ""
#     SMTP_FROM_EMAIL: str = ""



#     FRONTEND_URL: str = "http://localhost:3000"




#     model_config = SettingsConfigDict(
#         env_file=".env",
#         extra="ignore",
#     )


#     app_name: str = "AI Portfolio Assistant API"
#     database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/portfolio_ai"
#     openrouter_api_key: str = ""
#     openrouter_model: str = "openai/gpt-4o-mini"
#     openrouter_base_url: str = "https://openrouter.ai/api/v1"
#     openrouter_site_url: str = "http://localhost:3000"
#     openrouter_site_name: str = "My Portfolio"
#     frontend_origins: str = "http://localhost:3000"
#     max_question_chars: int = 2000
#     max_context_chars: int = 12000

#     @property
#     def cors_origins(self) -> list[str]:
#         return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]


# @lru_cache
# def get_settings() -> Settings:
#     return Settings()

# settings = Settings()


from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Taskino Portfolio Assistant"
    FRONTEND_URL: str = "http://localhost:3000"
    FRONTEND_ORIGINS: str = "http://localhost:3000"

    # Database
    DATABASE_URL: str
    DB_ECHO: bool = False

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ISSUER: str = "taskino-auth"
    JWT_AUDIENCE: str = "taskino-api"

    COOKIE_SECURE:bool = False
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    EMAIL_VERIFICATION_EXPIRE_MINUTES: int = 30

    # SMTP
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""

    # OpenRouter
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "openai/gpt-4o-mini"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_SITE_URL: str = "http://localhost:3000"
    OPENROUTER_SITE_NAME: str = "My Portfolio"

    # AI limits
    MAX_QUESTION_CHARS: int = 2000
    MAX_CONTEXT_CHARS: int = 12000



    # Guest chat cookie
    GUEST_COOKIE_NAME: str = "portfolio_guest"
    GUEST_COOKIE_MAX_AGE_SECONDS: int = 60 * 60 * 24 * 30
    GUEST_COOKIE_SECURE: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip().rstrip("/")
            for origin in self.FRONTEND_ORIGINS.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
