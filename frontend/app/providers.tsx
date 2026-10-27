// "use client";

// import { useEffect } from "react";
// import { useAuthStore } from "@/store/auth.store";
// import { refreshSession } from "@/lib/api";
// import { getAccessToken } from "@/lib/auth-client";

// export function AuthBootstrap({ children }: { children: React.ReactNode }) {
//   const { setUser, clear, isHydrated } = useAuthStore();

//   useEffect(() => {
//     if (!isHydrated) return;

//     // اگر توکن در حافظه نیست (بعد از رفرش صفحه) → تلاش برای refresh
//     if (!getAccessToken()) {
//       refreshSession().then((data) => {
//         if (data) setUser(data.user);
//         else clear();
//       });
//     }
//   }, [isHydrated, setUser, clear]);

//   return <>{children}</>;
// }



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
