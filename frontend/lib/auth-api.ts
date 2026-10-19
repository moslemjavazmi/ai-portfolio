import type { User } from "@/store/auth.store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL!;

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {

  const response = await fetch(
    `${API_URL}/api/auth/login`,       // ← اضافه شدن /api/auth
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail ?? "Login failed");
  }

  return data;
}