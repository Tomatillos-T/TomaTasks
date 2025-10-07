// services/authService.ts
import { HttpClient } from "../services/httpClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  role: {
    id: string;
    role: string;
  };
  enabled: boolean;
  username: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const data = await HttpClient.post<LoginResponse>("/api/auth/login", credentials);
    localStorage.setItem("jwtToken", data.token);
    return data;
  }

  async register(userData: RegisterData): Promise<User> {
    return HttpClient.post<User>("/api/auth/signup", userData);
  }

  logout(): void {
    localStorage.removeItem("jwtToken");
  }
}

export default new AuthService();
