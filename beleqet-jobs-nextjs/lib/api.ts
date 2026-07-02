import { getAccessToken, getRefreshToken, saveAuth, clearAuth } from "./auth-storage";
import type { ApiErrorBody, AuthResponse } from "./types/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

function parseErrorMessage(body: ApiErrorBody): string {
  if (Array.isArray(body.message)) return body.message.join(". ");
  return body.message ?? "Something went wrong";
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const accessToken = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (accessToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry && getRefreshToken() && !path.startsWith("/auth/")) {
    const refreshed = await refreshTokens();
    if (refreshed) return request<T>(path, options, false);
  }

  if (res.status === 204) return undefined as T;

  const body = (await res.json().catch(() => ({}))) as ApiErrorBody | T;

  if (!res.ok) {
    const errBody = body as ApiErrorBody;
    throw new ApiError(res.status, parseErrorMessage(errBody));
  }

  return body as T;
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearAuth();
      return false;
    }

    const data = (await res.json()) as AuthResponse;
    saveAuth(data.accessToken, data.refreshToken, data.user);
    return true;
  } catch {
    clearAuth();
    return false;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
};
