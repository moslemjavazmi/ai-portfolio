// import type { User } from "@/store/auth.store";
// import { getAccessToken, setAccessToken, clearAccessToken } from "./auth-client";

// const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// export interface AuthResponse {
//   access_token: string;
//   refresh_token?: string;
//   token_type?: string;
//   user: User;
// }

// // --- Login ---
// export async function login(email: string, password: string): Promise<AuthResponse> {
//   const response = await fetch(`${API_URL}/api/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",                 // ← برای دریافت/ارسال کوکی refresh
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await response.json();
//   if (!response.ok) throw new Error(data.detail ?? "Login failed");

//   setAccessToken(data.access_token);
//   return data;
// }

// // --- Refresh (با کوکی httpOnly) ---
// export async function refreshSession(): Promise<AuthResponse | null> {
//   try {
//     const response = await fetch(`${API_URL}/api/auth/refresh`, {
//       method: "POST",
//       credentials: "include",
//     });
//     if (!response.ok) return null;
//     const data: AuthResponse = await response.json();
//     setAccessToken(data.access_token);
//     return data;
//   } catch {
//     return null;
//   }
// }

// // --- Logout ---
// export async function logout(): Promise<void> {
//   try {
//     await fetch(`${API_URL}/api/auth/logout`, {
//       method: "POST",
//       credentials: "include",
//     });
//   } catch {
//     /* ignore */
//   } finally {
//     clearAccessToken();
//   }
// }

// // --- Fetch با هدر Authorization + retry خودکار روی 401 ---
// export async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
//   const token = getAccessToken();

//   const headers = new Headers(init.headers);
//   if (token) headers.set("Authorization", `Bearer ${token}`);

//   let res = await fetch(input, { ...init, headers, credentials: "include" });

//   // اگر access token منقضی شده بود، یک بار refresh و مجدد تلاش
//   if (res.status === 401) {
//     const refreshed = await refreshSession();
//     if (refreshed) {
//       headers.set("Authorization", `Bearer ${refreshed.access_token}`);
//       res = await fetch(input, { ...init, headers, credentials: "include" });
//     }
//   }

//   return res;
// }


import type { User } from "@/store/auth.store";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface AuthResponse {
  access_token: string;
  token_type?: string;
  user: User;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail ?? "Login failed");
  }

  setAccessToken(data.access_token);
  return data;
}

export async function refreshSession(): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data: AuthResponse = await response.json();
    setAccessToken(data.access_token);
    return data;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const token = getAccessToken();

  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });
  } finally {
    clearAccessToken();
  }
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && token) {
    const refreshed = await refreshSession();

    if (refreshed) {
      headers.set(
        "Authorization",
        `Bearer ${refreshed.access_token}`,
      );

      response = await fetch(input, {
        ...init,
        headers,
        credentials: "include",
      });
    }
  }

  return response;
}
