import { useUserContext } from "@/contexts/UserContext";
import { useMemo } from "react";

/**
 * Hook to manage role-based access control
 */
export const useRole = () => {
  const { user } = useUserContext();

  const userRole = user?.role;

  const hasRole = (roles: string | string[]): boolean => {
    if (!userRole) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
  };

  const isAdmin = useMemo(() => hasRole("ROLE_ADMIN"), [userRole]);
  const isDeveloper = useMemo(() => hasRole("ROLE_DEVELOPER"), [userRole]);

  return {
    userRole,
    hasRole,
    isAdmin,
    isDeveloper,
  };
};
