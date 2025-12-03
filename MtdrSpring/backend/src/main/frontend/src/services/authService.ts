// services/authService.ts
import { HttpClient } from "@/services/httpClient";
import { mapRoleToFrontend, mapRoleToBackend } from "@/utils/roleMapper";

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
  user: User;
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  role: string;
  enabled: boolean;
  username: string;
  githubId?: string;
  githubUsername?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const data = await HttpClient.post<LoginResponse>(
      "/api/auth/login",
      credentials
    );

    // Map backend role format to frontend format
    if (data.user && data.user.role) {
      data.user.role = mapRoleToFrontend(data.user.role);
    }

    localStorage.setItem("jwtToken", data.token);
    return data;
  }

  async register(userData: RegisterData): Promise<User> {
    // Map frontend role format to backend format before sending
    const backendUserData = {
      ...userData,
      role: userData.role ? mapRoleToBackend(userData.role) : undefined,
    };

    const user = await HttpClient.post<User>("/api/auth/signup", backendUserData);

    // Map backend role format to frontend format in response
    if (user && user.role) {
      user.role = mapRoleToFrontend(user.role);
    }

    return user;
  }

  logout(): void {
    localStorage.removeItem("jwtToken");
  }
}

export default new AuthService();
