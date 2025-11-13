import { Navigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";
import type { ReactNode } from "react";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

/**
 * RoleBasedRoute component that guards routes based on user roles.
 * Redirects users without proper role permissions to a specified route.
 */
export default function RoleBasedRoute({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
}: RoleBasedRouteProps) {
  const { user, isAuthenticated } = useUserContext();
  const token = localStorage.getItem("jwtToken");

  // Check authentication first
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  const userRole = user?.role?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    // User doesn't have permission, redirect to allowed page
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
