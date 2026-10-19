# # # from fastapi import FastAPI
# # # app = FastAPI(
# # #     title="auth service",
# # #     version="1.0.0"
# # # )
# # # @app.get("/healthy")
# # # async def healthy_check():
# # #     return {
# # #         "status":"ok",
# # #         "service":"auth-service"
# # #     }

# # # backend/main.py
# # from fastapi import FastAPI
# # from fastapi.middleware.cors import CORSMiddleware

# # app = FastAPI()

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["http://localhost:3000"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # @app.post("/api/auth/login")
# # async def login(payload: dict):
# #     print('login fetch worked')
# #     return {"access_token": "demo-token", "token_type": "bearer"}

# # @app.post("/api/auth/register")
# # async def register(payload: dict):
# #     return {"id": 1, "email": payload["email"]}

# # @app.post("/api/chat")
# # async def chat(payload: dict):
# #     # منطق چت‌بات شما (اتصال به LLM)
# #     return {"reply": f"شما گفتید: {payload['message']}"}


# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.api.auth import router as auth_router
# from app.core.config import settings


# app = FastAPI(
#     title=settings.APP_NAME,
# )


# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=[
# #         settings.FRONTEND_URL,
# #     ],
# #     allow_credentials=True,
# #     allow_methods=[
# #         "GET",
# #         "POST",
# #         "PUT",
# #         "PATCH",
# #         "DELETE",
# #     ],
# #     allow_headers=[
# #         "Content-Type",
# #         "Authorization",
# #         "X-CSRF-Token",
# #     ],
# # )
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         settings.FRONTEND_URL,
#     ],
#     allow_credentials=True,
#     allow_methods=[
#         "GET",
#         "POST",
#         "PUT",
#         "PATCH",
#         "DELETE",
#     ],
#     allow_headers=[
#         "Content-Type",
#         "Authorization",
#         "X-CSRF-Token",
#     ],
# )

# app.include_router(auth_router)


# @app.get("/health")
# async def health():
#     return {
#         "status": "ok",
#     }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],          # ← همه متدها (OPTIONS هم پوشش داده می‌شود)
    allow_headers=["*"],          # ← همه هدرها
)


# ← اینجا پیشوند /api اضافه می‌شود
app.include_router(auth_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}