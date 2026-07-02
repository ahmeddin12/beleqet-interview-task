export type UserRole = "ADMIN" | "EMPLOYER" | "JOB_SEEKER" | "FREELANCER";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  path?: string;
  timestamp?: string;
}
