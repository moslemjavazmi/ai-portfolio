"use client";

import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { MessageSquare, TrendingUp, Clock, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    { label: "گفتگوهای امروز", value: "۱۲", icon: MessageSquare, trend: "+۸٪" },
    { label: "پیام‌های کل", value: "۲۴۷", icon: TrendingUp, trend: "+۲۳٪" },
    { label: "میانگین پاسخ", value: "۱.۲ ثانیه", icon: Clock, trend: "پایدار" },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          سلام {user?.name?.split(" ")[0] ?? "دوست"} 👋
        </h1>
        <p className="text-neutral-600 mt-1">به داشبورد خود خوش آمدید</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-neutral-100 grid place-items-center">
                <s.icon size={18} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {s.trend}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-neutral-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CTA Card */}
      <div className="rounded-2xl bg-black text-white p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <h2 className="text-2xl font-bold">گفتگوی جدیدی شروع کنید</h2>
          <p className="text-white/70 mt-2 text-sm leading-relaxed">
            هر سوالی که داری، دستیار هوشمند ما آماده پاسخ است.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 mt-6 h-11 px-5 rounded-xl bg-white text-black font-medium hover:bg-neutral-100 transition-colors"
          >
            <Sparkles size={16} />
            شروع گفتگو
          </Link>
        </div>
        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      </div>
    </div>
  );
}