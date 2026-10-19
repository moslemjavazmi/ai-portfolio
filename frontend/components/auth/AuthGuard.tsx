"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getAccessToken } from "@/lib/auth-client";
import { refreshSession } from "@/lib/api";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, setUser, clear } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    const check = async () => {
      // ۱) اگر از قبل لاگین است، عبور کن
      if (isAuthenticated && getAccessToken()) {
        setChecking(false);
        return;
      }

      // ۲) اگر توکن در حافظه نبود، تلاش برای refresh
      const data = await refreshSession();
      if (data) {
        setUser(data.user);
        setChecking(false);
      } else {
        clear();
        router.replace("/login");
      }
    };

    check();
  }, [isHydrated, isAuthenticated, router, setUser, clear]);

  if (!isHydrated || checking) {
    return (
      <div className="h-screen grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-neutral-300 border-t-black animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
}