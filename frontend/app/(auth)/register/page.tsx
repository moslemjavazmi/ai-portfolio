"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(form),
  //       }
  //     );

  //     if (!res.ok) {
  //       const data = await res.json().catch(() => ({}));
  //       throw new Error(data.detail || "خطا در ثبت‌نام");
  //     }

  //     router.push("/login?registered=1");
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "خطای ناشناخته");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail ?? "خطا در ثبت‌نام");
      }

      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  };
  const benefits = [
    "دسترسی نامحدود به مدل‌های هوش مصنوعی",
    "تاریخچه گفتگوهای امن و شخصی",
    "پشتیبانی از تیم‌ها و پروژه‌ها"
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* فرم (چپ در این صفحه، برای تنوع) */}
      <main className="flex items-center justify-center p-6 lg:p-16 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12 text-2xl font-bold tracking-tight">
            ChatBot
          </div>

          <header className="mb-10">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 mb-3">
              ساخت حساب کاربری
            </h2>
            <p className="text-neutral-600">در کمتر از یک دقیقه شروع کنید.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="name"
              type="text"
              label="نام و نام خانوادگی"
              placeholder="علی رضایی"
              value={form.name}
              onChange={update("name")}
              required
            />
            <Input
              id="email"
              type="email"
              label="ایمیل"
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
              autoComplete="email"
              required
            />
            <Input
              id="password"
              type="password"
              label="رمز عبور"
              placeholder="حداقل ۸ کاراکتر"
              value={form.password}
              onChange={update("password")}
              autoComplete="new-password"
              minLength={8}
              required
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "در حال ساخت..." : "ساخت حساب"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-600">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              href="/login"
              className="text-black font-semibold underline underline-offset-4 decoration-2 hover:decoration-black/30 transition-all"
            >
              وارد شوید
            </Link>
          </p>
        </div>
      </main>

      {/* پنل برند (راست در این صفحه) */}
      <aside className="hidden lg:flex flex-col justify-between bg-black text-white p-12 xl:p-16 order-1 lg:order-2">
        <div className="text-2xl font-bold tracking-tight">ChatBot</div>

        <div className="max-w-lg space-y-10">
          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
            به آینده‌ی
            <br />
            گفتگو خوش آمدید.
          </h1>

          <ul className="space-y-4">
            {benefits.map((text) => (
              <li
                key={text}
                className="flex items-start gap-3 text-neutral-300"
              >
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shrink-0">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-neutral-500">© 2026 ChatBot Inc.</div>
      </aside>
    </div>
  );
}