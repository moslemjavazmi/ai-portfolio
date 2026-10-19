"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth.store";
import {
  setAccessToken
} from "@/lib/auth-client";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const setUser = useAuthStore(
  (state) => state.setUser
);
 const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const data = await login(
        email,
        password
      );

      setAccessToken(
        data.access_token
      );

      setUser(data.user);

      router.push("/dashboard");

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "خطای ناشناخته"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* === پنل برند (چپ) === */}
      <aside className="hidden lg:flex flex-col justify-between bg-black text-white p-12 xl:p-16">
        <div className="text-2xl font-bold tracking-tight">ChatBot</div>

        <div className="max-w-lg space-y-8">
          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
            گفتگو با هوش مصنوعی،
            <br />
            به سادگی یک پیام.
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            پلتفرم حرفه‌ای چت‌بات برای تیم‌ها و کسب‌وکارها. سریع، امن و
            مقیاس‌پذیر.
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>© 2026 ChatBot Inc.</span>
          <span>v1.0.0</span>
        </div>
      </aside>

      {/* === فرم (راست) === */}
      <main className="flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          {/* لوگو در موبایل */}
          <div className="lg:hidden mb-12 text-2xl font-bold tracking-tight">
            ChatBot
          </div>

          <header className="mb-10">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 mb-3">
              خوش آمدید
            </h2>
            <p className="text-neutral-600">
              برای ادامه، وارد حساب کاربری خود شوید.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              type="email"
              label="ایمیل"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              // required
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium">
                  رمز عبور
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-neutral-600 hover:text-black transition-colors"
                >
                  فراموش کرده‌اید؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                // required
              />
            </div>

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
              {loading ? "در حال ورود..." : "ورود"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-600">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="text-black font-semibold underline underline-offset-4 decoration-2 hover:decoration-black/30 transition-all"
            >
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}