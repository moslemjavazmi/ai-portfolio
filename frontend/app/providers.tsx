"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { refreshSession } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-client";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { setUser, clear, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    // اگر توکن در حافظه نیست (بعد از رفرش صفحه) → تلاش برای refresh
    if (!getAccessToken()) {
      refreshSession().then((data) => {
        if (data) setUser(data.user);
        else clear();
      });
    }
  }, [isHydrated, setUser, clear]);

  return <>{children}</>;
}