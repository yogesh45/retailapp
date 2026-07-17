import api from "@/services/api";
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from "@/types/auth";

class AuthService {
  async login(
    request: LoginRequest
  ): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      request
    );

    return response.data;
  }

  saveSession(response: LoginResponse): void {
    const user: AuthUser = {
      email: response.email,
      role: response.role,
    };

    sessionStorage.setItem(
      "access_token",
      response.access_token
    );

    sessionStorage.setItem(
      "auth_user",
      JSON.stringify(user)
    );
  }

  getUser(): AuthUser | null {
    if (typeof window === "undefined") {
      return null;
    }

    const value = sessionStorage.getItem("auth_user");

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    return Boolean(
      sessionStorage.getItem("access_token")
    );
  }

  logout(): void {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("auth_user");
  }
}

const authService = new AuthService();

export default authService;