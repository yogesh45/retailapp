export type UserRole = "ADMIN" | "VIEWER";

export interface LoginRequest{
    email : string;
    password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  email: string;
}

export interface User {
  id: number;
  email: string;
  role: "ADMIN" | "VIEWER";
}

export interface AuthUser {
  email: string;
  role: UserRole;
}