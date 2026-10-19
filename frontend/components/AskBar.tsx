"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "تجربه کاری شما چیست؟",
  "چرا Taskino را ساختید؟",
  "چطور با شما تماس بگیرم؟",
];

export function AskBar() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // کلید میانبر: Cmd/Ctrl + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSend = async () => {
    const text = value.trim();
    if (!text || loading) return;

    setLoading(true);
    try {
      // TODO: مسیر بک‌اند را تنظیم کن
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message: text }),
      // });
      await new Promise((r) => setTimeout(r, 400)); // دمو

      setValue("");
      setSent(true);
      setTimeout(() => setSent(false), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 pointer-events-none">
      <div className="pointer-events-auto">
        {/* Suggestion chips */}
        <div
          className={cn(
            "flex flex-wrap justify-center gap-1.5 mb-2 transition-all duration-300",
            focused && !value && !sent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          )}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setValue(s);
                inputRef.current?.focus();
              }}
              className="px-3 py-1.5 text-[11px] rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-emerald-500/40 backdrop-blur-md transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div
          className={cn(
            "relative flex items-center gap-2 p-2 pr-4 rounded-2xl",
            "bg-zinc-900/85 backdrop-blur-xl border transition-all duration-300",
            focused
              ? "border-emerald-500/50 shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]"
              : "border-zinc-800 shadow-lg shadow-black/40"
          )}
        >
          <Sparkles
            size={18}
            className={cn(
              "shrink-0 transition-colors",
              focused ? "text-emerald-400 animate-pulse" : "text-zinc-600"
            )}
          />

          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 180)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              sent
                ? "✓ دریافت شد — به‌زودی پاسخ می‌دهم"
                : "از من هر چیزی بپرسید...  (⌘K)"
            }
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!value.trim() || loading}
            className={cn(
              "h-9 w-9 rounded-xl grid place-items-center shrink-0 transition-all",
              value.trim() && !loading
                ? "bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95"
                : sent
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            )}
            aria-label="ارسال"
          >
            {sent ? <Check size={15} /> : <Send size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}