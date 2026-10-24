"""Admin-auth integration point.

IMPORTANT: Replace get_current_admin with the dependency from your existing auth system.
Do not leave admin endpoints publicly accessible. This default fails closed (HTTP 501).
Example after integration:
    from app.auth.dependencies import get_current_admin
and delete the placeholder below. Adapt the import to your real project.
"""
from typing import Any
from fastapi import HTTPException, status

async def get_current_admin() -> Any:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Connect this endpoint to your existing admin authentication dependency.",
    )
