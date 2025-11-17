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
  const { isAuthenticated } = useUserContext();
  const token = localStorage.getItem("jwtToken");
  const location = useLocation();

  // Check both context and token for authentication
  if (!isAuthenticated || !token) {
    // Redirect to login and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
