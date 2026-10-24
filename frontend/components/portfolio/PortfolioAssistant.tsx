// 'use client';

// import { useEffect, useState } from 'react';
// import type { FormEvent } from 'react';

// type SuggestedQuestion = { id?: string; question: string; category?: string };
// type ChatMessage = { role: 'user' | 'assistant'; content: string; sources?: string[]; suggestions?: string[] };
// type ChatResponse = {
//   conversation_id: string;
//   answer: string;
//   suggested_questions: string[];
//   sources: string[];
// };

// const API_BASE = (process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000').replace(/\/$/, '');

// const FALLBACK_QUESTIONS: SuggestedQuestion[] = [
//   { question: 'Can you explain Taskino’s overall architecture?', category: 'architecture' },
//   { question: 'Why did you use Kafka in Taskino?', category: 'backend' },
//   { question: 'Which parts of Taskino did you personally implement?', category: 'ownership' },
//   { question: 'What are your strongest backend technologies?', category: 'skills' },
// ];

// export default function PortfolioAssistant() {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [suggestions, setSuggestions] = useState<SuggestedQuestion[]>(FALLBACK_QUESTIONS);
//   const [input, setInput] = useState('');
//   const [conversationId, setConversationId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // The session ID is only a conversation locator, not an authentication credential.
//     const stored = window.sessionStorage.getItem('portfolio-ai-conversation-id');
//     if (stored) setConversationId(stored);
//     fetch(`${API_BASE}/api/questions`)
//       .then(async (res) => {
//         if (!res.ok) throw new Error('Could not load suggested questions');
//         return res.json();
//       })
//       .then((data: SuggestedQuestion[]) => { if (Array.isArray(data) && data.length) setSuggestions(data); })
//       .catch(() => { /* Keep built-in questions if the API is not available. */ });
//   }, []);

//   async function ask(questionText: string) {
//     const question = questionText.trim();
//     if (!question || loading) return;
//     setError(null);
//     setInput('');
//     setMessages((current) => [...current, { role: 'user', content: question }]);
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE}/api/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ question, conversation_id: conversationId, language: 'en' }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data?.detail || 'The assistant could not answer right now.');
//       const result = data as ChatResponse;
//       setConversationId(result.conversation_id);
//       window.sessionStorage.setItem('portfolio-ai-conversation-id', result.conversation_id);
//       setMessages((current) => [...current, {
//         role: 'assistant', content: result.answer, sources: result.sources,
//         suggestions: result.suggested_questions,
//       }]);
//     } catch (e) {
//       const message = e instanceof Error ? e.message : 'Unexpected error';
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function submit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     void ask(input);
//   }

//   function startNewConversation() {
//     setConversationId(null);
//     window.sessionStorage.removeItem('portfolio-ai-conversation-id');
//     setMessages([]);
//     setError(null);
//   }

//   return (
//     <section aria-labelledby="portfolio-assistant-title" className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:p-6">
//       <header className="mb-4 flex items-start justify-between gap-3">
//         <div>
//           <p className="text-sm font-medium text-violet-600 dark:text-violet-400">AI PORTFOLIO ASSISTANT</p>
//           <h2 id="portfolio-assistant-title" className="mt-1 text-xl font-semibold">Ask about my work</h2>
//           <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Explore my skills, projects, architecture and engineering decisions.</p>
//         </div>
//         <button type="button" onClick={startNewConversation} className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900">
//           New chat
//         </button>
//       </header>

//       {messages.length === 0 ? (
//         <div className="mb-4 grid gap-2 sm:grid-cols-2">
//           {suggestions.map((item) => (
//             <button key={item.id || item.question} type="button" disabled={loading} onClick={() => void ask(item.question)} className="rounded-xl border border-slate-200 p-3 text-left text-sm transition hover:border-violet-400 hover:bg-violet-50 disabled:opacity-50 dark:border-slate-800 dark:hover:bg-violet-950/30">
//               <span className="block text-xs uppercase tracking-wide text-slate-500">{item.category || 'Explore'}</span>
//               <span className="mt-1 block font-medium">{item.question}</span>
//             </button>
//           ))}
//         </div>
//       ) : (
//         <div className="mb-4 max-h-[560px] space-y-4 overflow-y-auto pr-1" aria-live="polite">
//           {messages.map((message, index) => (
//             <article key={`${index}-${message.role}`} className={`rounded-xl p-4 ${message.role === 'user' ? 'ml-8 bg-violet-50 dark:bg-violet-950/40' : 'mr-4 bg-slate-50 dark:bg-slate-900'}`}>
//               <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{message.role === 'user' ? 'You' : 'Portfolio assistant'}</p>
//               <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
//               {message.sources?.length ? <p className="mt-3 text-xs text-slate-500">Sources: {message.sources.join(', ')}</p> : null}
//               {message.role === 'assistant' && message.suggestions?.length ? (
//                 <div className="mt-4 flex flex-wrap gap-2">
//                   {message.suggestions.map((question) => <button key={question} type="button" disabled={loading} onClick={() => void ask(question)} className="rounded-full border border-violet-200 px-3 py-1.5 text-left text-xs hover:bg-violet-50 disabled:opacity-50 dark:border-violet-900 dark:hover:bg-violet-950/50">{question}</button>)}
//                 </div>
//               ) : null}
//             </article>
//           ))}
//           {loading ? <p className="px-3 text-sm text-slate-500">Thinking…</p> : null}
//         </div>
//       )}

//       {error ? <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p> : null}
//       <form onSubmit={submit} className="flex items-end gap-2">
//         <label className="sr-only" htmlFor="portfolio-assistant-input">Ask a question</label>
//         <textarea id="portfolio-assistant-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void ask(input); } }} maxLength={2000} rows={2} placeholder="Ask a question… (Enter to send)" className="min-h-12 flex-1 resize-y rounded-xl border border-slate-300 bg-transparent px-3 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:focus:ring-violet-900" />
//         <button type="submit" disabled={loading || !input.trim()} className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">{loading ? '…' : 'Ask'}</button>
//       </form>
//       <p className="mt-2 text-xs text-slate-500">AI-generated answers may be incomplete. For exact implementation details, review the project documentation and source code.</p>
//     </section>
//   );
// }



"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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

const fallbackQuestions: SuggestedQuestion[] = [
  { question: "What is Taskino and how is it designed?" },
  { question: "What are your main backend skills?" },
  { question: "How do you use AI in your projects?" },
];

export default function PortfolioAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the AI assistant for this portfolio. Ask me about my projects, technical skills, or engineering decisions.",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] =
    useState<SuggestedQuestion[]>(fallbackQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      try {
        const response = await fetch(`${API_URL}/api/questions`);

        if (!response.ok) return;

        const data: SuggestedQuestion[] = await response.json();

        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setSuggestions(data);
        }
      } catch {
        // Keep the built-in questions if the API is unavailable.
      }
    }

    void loadQuestions();

    return () => {
      cancelled = true;
    };
  }, []);

  async function sendQuestion(
    event?: FormEvent<HTMLFormElement>,
    selectedQuestion?: string,
  ) {
    event?.preventDefault();

    const text = (selectedQuestion ?? question).trim();

    if (!text || isLoading) return;

    setError("");
    setQuestion("");

    setMessages((current) => [
      ...current,
      { role: "user", content: text },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
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
        throw new Error(
          response.status === 429
            ? "Too many requests. Please try again shortly."
            : "The assistant could not respond. Please try again.",
        );
      }

      const data = await response.json();

      setConversationId(data.conversation_id);
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

        <span className="ml-auto rounded-full border border-emerald-400/20 px-3 py-1 text-xs text-emerald-300">
          AI powered
        </span>
      </header>

      <div
        className="max-h-[460px] min-h-[260px] space-y-4 overflow-y-auto p-5"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {messages.map((message, index) => (
          <div
            key={`${index}-${message.role}`}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
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
                        <li key={`${source}-${sourceIndex}`}>{source}</li>
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
              className="rounded-full border border-white/10 px-3 py-2 text-left text-xs text-zinc-300 transition hover:border-emerald-400/50 hover:text-emerald-300"
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
          disabled={isLoading}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-emerald-400/60 disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}
