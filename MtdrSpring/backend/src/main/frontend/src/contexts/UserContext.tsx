import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { User } from "@/services/authService";
import { authEvents } from "@/utils/authEvents";
import { HttpClient } from "@/services/httpClient";
import { mapRoleToFrontend } from "@/utils/roleMapper";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isValidating: boolean;
  sessionExpiredMessage: string | null;
  clearSessionExpiredMessage: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isValidating, setIsValidating] = useState<boolean>(() => {
    // Only validate if there's a stored token
    return !!localStorage.getItem("jwtToken");
  });
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);

  // Clear the session expired message
  const clearSessionExpiredMessage = useCallback(() => {
    setSessionExpiredMessage(null);
  }, []);

  // Validate token on app startup
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("jwtToken");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        // No token or user, clear everything
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        setUser(null);
        setIsValidating(false);
        return;
      }

      try {
        // Validate token by fetching current user data
        const userData = await HttpClient.get<User>(`/api/user/${JSON.parse(storedUser).id}`, { auth: true });
        // Map backend role format to frontend format
        if (userData && userData.role) {
          userData.role = mapRoleToFrontend(userData.role);
        }
        setUser(userData);
        setIsValidating(false);
      } catch (error) {
        // Token is invalid - this will trigger the auth event automatically via HttpClient
        // The 401/403 handler in HttpClient will call authEvents.invalidateSession()
        console.warn("Token validation failed:", error);
        setIsValidating(false);
      }
    };

    validateToken();
  }, []);

  // Listen for auth invalidation events
  useEffect(() => {
    const unsubscribe = authEvents.on('sessionExpired', (reason) => {
      setUser(null);
      setSessionExpiredMessage(reason || 'Tu sesión ha expirado.');
    });

    return unsubscribe;
  }, []);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      isAuthenticated: !!user,
      isValidating,
      sessionExpiredMessage,
      clearSessionExpiredMessage
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext debe usarse dentro de un UserProvider");
  }
  return context;
};
