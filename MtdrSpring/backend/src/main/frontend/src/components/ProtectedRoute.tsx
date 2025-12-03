import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component that guards routes requiring authentication.
 * Redirects unauthenticated users to the login page while preserving the intended destination.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isValidating } = useUserContext();
  const token = localStorage.getItem("jwtToken");
  const location = useLocation();

  // Show loading state while validating token on app startup
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-default">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-main border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary">Validando sesión...</p>
        </div>
      </div>
    );
  }

  // Check both context and token for authentication
  if (!isAuthenticated || !token) {
    // Redirect to login and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
