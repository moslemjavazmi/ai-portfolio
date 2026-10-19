"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Send } from "lucide-react";
import { Sidebar } from "@/components/chat/Sidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { cn } from "@/lib/utils";
import {
  getAccessToken,
} from "@/lib/auth-client";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "سلام 👋\nمن دستیار هوشمند شما هستم. چطور می‌توانم امروز کمکتان کنم؟",
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "گفتگوی جدید", messages: [WELCOME_MESSAGE] },
  ]);
  const [activeId, setActiveId] = useState("1");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId)!;

  // اسکرول خودکار به پایین
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [active.messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              // اگر اولین پیام کاربر است، عنوان را از آن بساز
              title: c.messages.length <= 1 ? text.slice(0, 30) : c.title,
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );
    setInput("");
    setLoading(true);

    try {
        const token = getAccessToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",

              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },

            body: JSON.stringify({
              message: text,
              conversation_id: activeId,
            }),
          }
        );

      if (!res.ok) throw new Error("پاسخ از سرور دریافت نشد");
      const data = await res.json();

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply ?? data.message ?? "پاسخی دریافت نشد.",
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, botMsg] } : c
        )
      );
    } catch (err) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "متأسفم، خطایی رخ داد. لطفاً دوباره تلاش کنید.",
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, errorMsg] } : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newConversation = () => {
    const id = crypto.randomUUID();
    setConversations((prev) => [
      { id, title: "گفتگوی جدید", messages: [WELCOME_MESSAGE] },
      ...prev,
    ]);
    setActiveId(id);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* سایدبار دسکتاپ */}
      <div className="hidden md:block">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={newConversation}
        />
      </div>

      {/* سایدبار موبایل */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full">
            <Sidebar
              isMobile
              conversations={conversations}
              activeId={activeId}
              onSelect={(id) => {
                setActiveId(id);
                setSidebarOpen(false);
              }}
              onNew={newConversation}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* بخش اصلی چت */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* هدر */}
        <header className="flex items-center gap-3 px-4 md:px-8 h-16 border-b border-neutral-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-neutral-100 rounded-lg"
            aria-label="باز کردن منو"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold tracking-tight truncate">
            {active.title}
          </h1>
        </header>

        {/* پیام‌ها */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-5">
            {active.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
              />
            ))}
            {loading && <TypingIndicator />}
          </div>
        </div>

        {/* ورودی */}
        <div className="border-t border-neutral-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-4">
            <div
              className={cn(
                "flex items-end gap-2 bg-neutral-100 rounded-2xl p-2 pl-4",
                "focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10 transition-all"
              )}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="پیام خود را بنویسید..."
                rows={1}
                className={cn(
                  "flex-1 bg-transparent resize-none max-h-40 py-2.5",
                  "text-neutral-900 placeholder:text-neutral-500",
                  "focus:outline-none text-[15px] leading-relaxed"
                )}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                  "bg-black text-white transition-all",
                  "hover:bg-neutral-800 active:scale-95",
                  "disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
                )}
                aria-label="ارسال"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="mt-2 text-xs text-neutral-500 text-center">
              Enter برای ارسال • Shift + Enter برای خط جدید
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}