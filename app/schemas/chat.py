import uuid
from pydantic import BaseModel, Field, ConfigDict

class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    conversation_id: uuid.UUID | None = None
    language: str = Field(default="en", pattern="^(en|fa|auto)$")

class SuggestedQuestionOut(BaseModel):
    id: uuid.UUID | None = None
    question: str
    category: str = "general"

class ChatResponse(BaseModel):
    conversation_id: uuid.UUID
    answer: str
    suggested_questions: list[str]
    sources: list[str]

class KnowledgeDocumentCreate(BaseModel):
    slug: str = Field(min_length=2, max_length=160, pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str = Field(min_length=2, max_length=240)
    content: str = Field(min_length=20, max_length=50000)
    is_published: bool = True

class KnowledgeDocumentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=240)
    content: str | None = Field(default=None, min_length=20, max_length=50000)
    is_published: bool | None = None

class KnowledgeDocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    slug: str
    title: str
    content: str
    is_published: bool

class SuggestedQuestionCreate(BaseModel):
    question: str = Field(min_length=5, max_length=500)
    category: str = Field(default="general", max_length=80)
    sort_order: int = 0
    is_active: bool = True

class SuggestedQuestionUpdate(BaseModel):
    question: str | None = Field(default=None, min_length=5, max_length=500)
    category: str | None = Field(default=None, max_length=80)
    sort_order: int | None = None
    is_active: bool | None = None
