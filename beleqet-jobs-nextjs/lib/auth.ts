import { api } from "@/lib/api";
import { saveAuth, clearAuth } from "@/lib/auth-storage";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/lib/types/auth";

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/auth/login", {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  });
  saveAuth(data.accessToken, data.refreshToken, data.user);
  return data;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/auth/register", {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    role: payload.role ?? "JOB_SEEKER",
  });
  saveAuth(data.accessToken, data.refreshToken, data.user);
  return data;
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Clear local session even if the server call fails
  } finally {
    clearAuth();
  }
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  return api.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
}
