import { Navigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import Login from "@/pages/Login";

interface LoginRouteProps {
  redirectTo?: string;
}

/**
 * LoginRoute component that guards the login page.
 * Redirects authenticated users to the specified route.
 */
export default function LoginRoute({
  redirectTo = "/dashboard",
}: LoginRouteProps) {
  const { isAuthenticated, isValidating } = useUserContext();
  const token = localStorage.getItem("jwtToken");

  // Show loading state while validating token
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

  // If authenticated and has valid token, redirect to dashboard
  if (isAuthenticated && token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Login />;
}
