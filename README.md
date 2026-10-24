# AI Portfolio Assistant — FastAPI + LangGraph + PostgreSQL

A starter implementation for a public recruiter-facing AI assistant. It stores conversations and knowledge in PostgreSQL, retrieves relevant published documents, asks an OpenRouter-hosted chat model to answer from that context, and generates follow-up questions.

## Important integration note

You already have an admin authentication system. This package deliberately does **not** implement another login system. Admin knowledge endpoints use `app/api/deps.py:get_current_admin`, which fails closed with HTTP 501 until you replace it with your existing admin-auth dependency. Do not expose admin routes without doing that.

The code is a working starter, not yet a drop-in replacement for your existing app. Merge the models/router/config carefully, especially if your project already has SQLAlchemy models or uses a different ORM.

## 1. Requirements

- Python 3.11+
- PostgreSQL
- An OpenRouter API key
- Your existing Next.js app (Tailwind classes are used by the component)

## 2. Install and configure

```bash
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and `FRONTEND_ORIGINS`.

Create the PostgreSQL database (example):

```sql
CREATE DATABASE portfolio_ai;
```

For local development, the app creates tables on startup. For production, replace `Base.metadata.create_all` with Alembic migrations.

## 3. Seed knowledge and suggested questions

```bash
python seed.py
```

Edit `knowledge/profile.md` and `knowledge/taskino.md` so they accurately reflect the current code and your CV. The seed script only inserts documents/questions that do not already exist; editing a Markdown file later will not overwrite the database row automatically. Update that row through the admin API or write a dedicated sync script.

## 4. Run API

```bash
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs` and `http://localhost:8000/api/health`.

Public routes:
- `GET /api/health`
- `GET /api/questions`
- `POST /api/chat`

Admin routes (blocked until auth integration):
- `GET /api/admin/knowledge`
- `POST /api/admin/knowledge`
- `PATCH /api/admin/knowledge/{document_id}`
- `DELETE /api/admin/knowledge/{document_id}`
- `GET /api/admin/questions`
- `POST /api/admin/questions`
- `PATCH /api/admin/questions/{question_id}`
- `DELETE /api/admin/questions/{question_id}`

Example chat request:

```json
{
  "question": "Can you explain Taskino's architecture?",
  "conversation_id": null,
  "language": "en"
}
```

## 5. Add the Next.js chat component

Copy `frontend/PortfolioAssistant.tsx` into your Next.js app, for example `src/components/PortfolioAssistant.tsx`. Set the frontend environment variable:

```bash
NEXT_PUBLIC_AI_API_URL=http://localhost:8000
```

Then render it in your page:

```tsx
import PortfolioAssistant from '@/components/PortfolioAssistant';

export default function HomePage() {
  return (
    <main>
      {/* Your existing portfolio sections */}
      <PortfolioAssistant />
    </main>
  );
}
```

The component uses Tailwind CSS. If your portfolio uses another styling system, adapt the classes.

## 6. Connect your existing admin auth

Open `app/api/deps.py`. Replace the placeholder with the exact dependency used by your current app to require an authenticated admin. For example, if your project exports `require_admin` from `app.auth.dependencies`, import and use that dependency on `admin_knowledge.py`. The name/path is intentionally not guessed because it depends on your existing code.

Your admin dependency must verify the current identity and admin role on the server. Do not trust a client-provided role, email, or `is_admin` boolean.

If the existing application already defines a shared `Base`, SQLAlchemy engine/session, or models, reuse those instead of creating a second database engine/Base. If your existing authentication uses SQLAlchemy, this integration is straightforward. If it uses another ORM, either migrate these models to that ORM or keep one deliberate shared database access layer; avoid two competing schemas.

## 7. Architecture and current limitations

- Retrieval is a small lexical search using `ILIKE`. It is intentionally simple for a small portfolio knowledge base.
- `pgvector` is not required yet. Add it only when semantic retrieval improves results on a test set.
- This implementation does not stream tokens. Add SSE after the basic request/response flow is tested.
- No public visitor login is needed. The frontend session ID is a conversation locator, not a credential.
- Add rate limiting, request-size limits at the proxy, retention/deletion policy, monitoring and cost controls before public production deployment.
- The starter stores chat messages; disclose this in a privacy notice and define retention/deletion behavior before going live.
- Admin routes intentionally return 501 until wired to your existing auth dependency.
- Model names available on OpenRouter can change. Set `OPENROUTER_MODEL` to a model currently enabled for your account.

## 8. Suggested next improvements

1. Replace development `create_all` with Alembic migrations.
2. Integrate the existing admin auth dependency.
3. Add admin UI forms for knowledge documents and suggested questions.
4. Add a source-aware evaluation set of 50–100 recruiter questions.
5. Consider PostgreSQL full-text search and `pgvector` based on retrieval evaluation.
6. Add rate limiting and conversation expiration/deletion.
