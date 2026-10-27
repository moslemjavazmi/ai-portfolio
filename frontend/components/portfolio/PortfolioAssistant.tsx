
"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

// import { authFetch } from "@/lib/api";
import { authFetch, refreshSession } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const CONVERSATION_STORAGE_KEY = "portfolio-conversation-id";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

type SuggestedQuestion = {
  id?: string;
  question: string;
  category?: string | null;
};

type ConversationItem = {
  id: string;
  created_at?: string;
};

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the AI assistant for this portfolio. Ask me about my projects, technical skills, or engineering decisions.",
};

const fallbackQuestions: SuggestedQuestion[] = [
  { question: "What is Taskino and how is it designed?" },
  { question: "What are your main backend skills?" },
  { question: "How do you use AI in your projects?" },
];

export default function PortfolioAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    welcomeMessage,
  ]);

  const [question, setQuestion] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] =
    useState<SuggestedQuestion[]>(fallbackQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [error, setError] = useState("");



  const isAuthenticated = useAuthStore(
  (state) => state.isAuthenticated
);
const isAuthHydrated = useAuthStore(
  (state) => state.isHydrated
);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Load suggested questions.
  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      try {
        const response = await fetch(`${API_URL}/api/questions`, {
          credentials: "include",
        });

        if (!response.ok) return;

        const data: SuggestedQuestion[] = await response.json();

        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setSuggestions(data);
        }
      } catch {
        // Keep fallback questions.
      }
    }

    void loadQuestions();

    return () => {
      cancelled = true;
    };
  }, []);

  // Restore the last conversation after auth state is ready.
  useEffect(() => {
    if (!isAuthHydrated) return;

    let cancelled = false;

    async function restoreConversation() {
      setIsRestoring(true);
      setError("");

      try {
        const savedId = localStorage.getItem(
          CONVERSATION_STORAGE_KEY,
        );

        if (!savedId) {
          setConversationId(null);
          setMessages([welcomeMessage]);
          return;
        }

        // If the user is logged in, refresh the access token
        // before requesting a conversation owned by that user.
        if (isAuthenticated) {
          try {
            await refreshSession();
          } catch {
            if (!cancelled) {
              setError(
                "Could not verify your session. Please sign in again and retry.",
              );
            }

            // Do not send the restore request without a valid
            // authenticated session: the backend may treat it
            // as a guest request and return a misleading 404.
            return;
          }
        }

        if (cancelled) return;

        const response = await authFetch(
          `${API_URL}/api/conversations/${encodeURIComponent(
            savedId,
          )}/messages`,
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({}));

          if (!cancelled) {
            setError(
              `Conversation restore failed (${response.status}): ${
                errorData.detail ?? "Unknown error"
              }`,
            );
          }

          // Preserve the saved ID so a transient failure
          // does not permanently discard the conversation.
          return;
        }

        const data = await response.json();

        if (cancelled) return;

        setConversationId(data.conversation_id ?? savedId);

        if (
          Array.isArray(data.messages) &&
          data.messages.length > 0
        ) {
          setMessages(
            data.messages.map(
              (message: {
                role: "user" | "assistant";
                content: string;
                sources?: string[];
              }) => ({
                role: message.role,
                content: message.content,
                sources: message.sources ?? [],
              }),
            ),
          );
        } else {
          setMessages([welcomeMessage]);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Could not restore the previous conversation. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsRestoring(false);
        }
      }
    }

    void restoreConversation();

    return () => {
      cancelled = true;
    };
  }, [isAuthHydrated, isAuthenticated]);


  async function sendQuestion(
    event?: FormEvent<HTMLFormElement>,
    selectedQuestion?: string,
  ) {
    event?.preventDefault();

    const text = (selectedQuestion ?? question).trim();

    if (!text || isLoading || isRestoring) return;

    setError("");
    setQuestion("");

    setMessages((current) => [
      ...current,
      { role: "user", content: text },
    ]);

    setIsLoading(true);

    try {
      const response = await authFetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          conversation_id: conversationId,
          language: "en",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.detail ??
            (response.status === 429
              ? "Too many requests. Please try again shortly."
              : "The assistant could not respond. Please try again."),
        );
      }

      const data = await response.json();

      setConversationId(data.conversation_id);

      if (data.conversation_id) {
        localStorage.setItem(
          CONVERSATION_STORAGE_KEY,
          data.conversation_id,
        );
      }

      if (
        Array.isArray(data.suggested_questions) &&
        data.suggested_questions.length > 0
      ) {
        setSuggestions(
          data.suggested_questions.map((item: string) => ({
            question: item,
          })),
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources ?? [],
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the assistant API.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function startNewChat() {
    setConversationId(null);
    localStorage.removeItem(CONVERSATION_STORAGE_KEY);
    setMessages([welcomeMessage]);
    setError("");
  }

  return (
    <section
      id="portfolio-assistant"
      className="w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-xl"
      aria-label="AI portfolio assistant"
    >
      <header className="flex items-center gap-3 border-b border-white/10 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-xl">
          ✦
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Portfolio AI Assistant
          </h2>
          <p className="text-sm text-zinc-400">
            Ask about projects, skills, and architecture
          </p>
        </div>

        <button
          type="button"
          onClick={startNewChat}
          disabled={isLoading || isRestoring}
          className="ml-auto rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:border-emerald-400/50 disabled:opacity-50"
        >
          New chat
        </button>
      </header>

      <div
        className="max-h-[460px] min-h-[260px] space-y-4 overflow-y-auto p-5"
        aria-live="polite"
        aria-busy={isLoading || isRestoring}
      >
        {isRestoring && (
          <p className="text-sm text-zinc-400" role="status">
            Restoring your conversation…
          </p>
        )}

        {messages.map((message, index) => (
          <div
            key={`${index}-${message.role}`}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                message.role === "user"
                  ? "bg-emerald-400 text-zinc-950"
                  : "border border-white/10 bg-zinc-900 text-zinc-100"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {message.role === "assistant" &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="mt-3 border-t border-white/10 pt-2">
                    <p className="mb-1 text-xs text-zinc-400">
                      Sources
                    </p>
                    <ul className="list-inside list-disc text-xs text-zinc-400">
                      {message.sources.map((source, sourceIndex) => (
                        <li key={`${source}-${sourceIndex}`}>
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        ))}

        {isLoading && (
          <p className="text-sm text-zinc-400" role="status">
            Assistant is thinking…
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!isLoading && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {suggestions.map((item, index) => (
            <button
              key={item.id ?? `${item.question}-${index}`}
              type="button"
              onClick={() => void sendQuestion(undefined, item.question)}
              disabled={isRestoring}
              className="rounded-full border border-white/10 px-3 py-2 text-left text-xs text-zinc-300 transition hover:border-emerald-400/50 hover:text-emerald-300 disabled:opacity-50"
            >
              {item.question}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="px-5 pb-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <form
        onSubmit={(event) => void sendQuestion(event)}
        className="flex gap-2 border-t border-white/10 p-4"
      >
        <label htmlFor="assistant-question" className="sr-only">
          Ask a question
        </label>

        <input
          id="assistant-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask me anything about this portfolio…"
          maxLength={2000}
          disabled={isLoading || isRestoring}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-emerald-400/60 disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={
            isLoading || isRestoring || !question.trim()
          }
          className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}
