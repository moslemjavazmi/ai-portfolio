# import asyncio
# from logging.config import fileConfig

# from sqlalchemy import pool
# from sqlalchemy.engine import Connection
# from sqlalchemy.ext.asyncio import async_engine_from_config

# from alembic import context

# # ------------------------------------------------------------------
# # ایمپورت Base و تنظیمات پروژه
# # ------------------------------------------------------------------
# from app.core.config import settings
# from app.core.database import Base

# # ------------------------------------------------------------------
# # ایمپورت مدل‌ها (نام فایل‌ها را با پروژه خود تطبیق دهید)
# # ------------------------------------------------------------------
# try:
#     from app.models.users import User  # noqa: F401
# except ImportError:
#     pass

# try:
#     from app.models.session import Session  # noqa: F401
# except ImportError:
#     pass

# try:
#     from app.models.email_verification import EmailVerification  # noqa: F401
# except ImportError:
#     pass

# # ------------------------------------------------------------------
# # target_metadata
# # ------------------------------------------------------------------
# target_metadata = Base.metadata


# # ------------------------------------------------------------------
# # تنظیم URL — بدون تبدیل، همان asyncpg بماند
# # ------------------------------------------------------------------
# config = context.config
# config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# if config.config_file_name is not None:
#     fileConfig(config.config_file_name)


# # ------------------------------------------------------------------
# # حالت offline
# # ------------------------------------------------------------------
# def run_migrations_offline() -> None:
#     url = config.get_main_option("sqlalchemy.url")
#     context.configure(
#         url=url,
#         target_metadata=target_metadata,
#         literal_binds=True,
#         dialect_opts={"paramstyle": "named"},
#     )
#     with context.begin_transaction():
#         context.run_migrations()


# # ------------------------------------------------------------------
# # حالت online (async)
# # ------------------------------------------------------------------
# def do_run_migrations(connection: Connection) -> None:
#     context.configure(
#         connection=connection,
#         target_metadata=target_metadata,
#         compare_type=True,
#     )
#     with context.begin_transaction():
#         context.run_migrations()


# async def run_async_migrations() -> None:
#     connectable = async_engine_from_config(
#         config.get_section(config.config_ini_section, {}),
#         prefix="sqlalchemy.",
#         poolclass=pool.NullPool,
#     )
#     async with connectable.connect() as connection:
#         await connection.run_sync(do_run_migrations)
#     await connectable.dispose()


# def run_migrations_online() -> None:
#     asyncio.run(run_async_migrations())


# if context.is_offline_mode():
#     run_migrations_offline()
# else:
#     run_migrations_online()



import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from app.core.config import settings
from app.core.database import Base

# Import all ORM models so they are registered in Base.metadata.
from app.models.users import User
from app.models.session import Session
from app.models.email_verification import EmailVerificationToken
from app.models.entities import (
    KnowledgeDocument,
    Conversation,
    ChatMessage,
    SuggestedQuestion,
)

# Keep explicit references so imports are not mistaken for unused code.
_ = (
    User,
    Session,
    EmailVerificationToken,
    KnowledgeDocument,
    Conversation,
    ChatMessage,
    SuggestedQuestion,
)

target_metadata = Base.metadata

config = context.config

# Escape percent signs in URLs before passing them to ConfigParser.
config.set_main_option(
    "sqlalchemy.url",
    settings.DATABASE_URL.replace("%", "%%"),
)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
