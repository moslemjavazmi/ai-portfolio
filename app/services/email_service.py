
from email.message import EmailMessage
from html import escape

import aiosmtplib
from fastapi import HTTPException, status

from app.core.config import settings


class EmailService:
    async def send_verification_email(
        self,
        email: str,
        token: str,
    ) -> None:
        if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
            raise RuntimeError(
                "SMTP credentials are not configured."
            )

        verification_url = (
            f"{settings.FRONTEND_URL.rstrip('/')}"
            f"/verify-email?token={token}"
        )

        safe_url = escape(verification_url, quote=True)

        message = EmailMessage()
        message["Subject"] = "Verify your ChatBot account"
        message["From"] = (
            settings.SMTP_FROM_EMAIL
            or settings.SMTP_USERNAME
        )
        message["To"] = email

        message.set_content(
            "Welcome to ChatBot!\n\n"
            "Please open the following link to verify "
            "your email address:\n\n"
            f"{verification_url}\n\n"
            "If you did not create this account, "
            "you can ignore this email."
        )

        message.add_alternative(
            f"""
            <!doctype html>
            <html lang="en">
              <body style="font-family:Arial,sans-serif;line-height:1.7">
                <h2>Welcome to ChatBot</h2>
                <p>Please verify your email address to activate your account.</p>
                <p>
                  <a href="{safe_url}"
                     style="display:inline-block;padding:12px 20px;
                            background:#111;color:#fff;
                            text-decoration:none;border-radius:6px">
                    Verify email
                  </a>
                </p>
                <p>If the button does not work, copy this link:</p>
                <p>{safe_url}</p>
                <p>If you did not create this account, ignore this email.</p>
              </body>
            </html>
            """,
            subtype="html",
        )

        try:
            await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USERNAME,
                password=settings.SMTP_PASSWORD,
                start_tls=True,
                timeout=20,
            )
        except Exception as exc:
            # Log the actual exception server-side in production.
            # Never expose SMTP credentials or provider details to clients.
            print(
                "Verification email delivery failed:",
                type(exc).__name__,
            )
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "We could not send the verification email. "
                    "Please try again later or request a new email."
                ),
            ) from exc
