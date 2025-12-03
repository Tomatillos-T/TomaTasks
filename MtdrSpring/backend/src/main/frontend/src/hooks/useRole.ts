import { useUserContext } from "@/contexts/UserContext";
import { useMemo } from "react";

/**
 * Hook to manage role-based access control
 * Note: Roles are mapped to frontend format (Admin, Developer) via roleMapper
 */
export const useRole = () => {
  const { user } = useUserContext();

  const userRole = user?.role;

  const hasRole = (roles: string | string[]): boolean => {
    if (!userRole) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
  };

  // Use frontend format roles (mapped from ROLE_ADMIN -> Admin, ROLE_DEVELOPER -> Developer)
  const isAdmin = useMemo(() => hasRole("Admin"), [userRole]);
  const isDeveloper = useMemo(() => hasRole("Developer"), [userRole]);

  return {
    userRole,
    hasRole,
    isAdmin,
    isDeveloper,
  };
};
