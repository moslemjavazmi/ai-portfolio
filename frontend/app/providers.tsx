"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { useAuthStore } from "@/store/auth.store";
import { refreshSession } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-client";

export function AuthBootstrap({
  children,
}: {
  children: ReactNode;
}) {
  const { setUser, clear, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    let cancelled = false;

    async function bootstrap() {
      if (getAccessToken()) return;

      const data = await refreshSession();

      if (cancelled) return;

      if (data) {
        setUser(data.user);
      } else {
        clear();
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, setUser, clear]);

  return <>{children}</>;
}
