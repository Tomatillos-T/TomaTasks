import { Navigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import Login from "@/pages/Login";

interface LoginRouteProps {
  redirectTo?: string;
}

/**
 * LoginRoute component that guards routes based on user roles.
 * Redirects users without proper role permissions to a specified route.
 */
export default function LoginRoute({
  redirectTo = "/dashboard",
}: LoginRouteProps) {
  const { isAuthenticated } = useUserContext();
  const token = localStorage.getItem("jwtToken");

  // Check authentication first
  if (isAuthenticated || token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Login />;
}
