/**
 * Maps backend role format (ROLE_ADMIN) to frontend format (Admin)
 */
export function mapRoleToFrontend(backendRole: string): string {
  switch (backendRole) {
    case "ROLE_ADMIN":
      return "Admin";
    case "ROLE_DEVELOPER":
      return "Developer";
    case "ROLE_USER":
      return "User";
    default:
      // Return as-is if unknown role, but remove ROLE_ prefix if it exists
      return backendRole.replace(/^ROLE_/, "");
  }
}

/**
 * Maps frontend role format (Admin) back to backend format (ROLE_ADMIN)
 */
export function mapRoleToBackend(frontendRole: string): string {
  switch (frontendRole) {
    case "Admin":
      return "ROLE_ADMIN";
    case "Developer":
      return "ROLE_DEVELOPER";
    case "User":
      return "ROLE_USER";
    default:
      // Add ROLE_ prefix if it doesn't exist
      return frontendRole.startsWith("ROLE_") ? frontendRole : `ROLE_${frontendRole}`;
  }
}

/**
 * Check if a role is Admin
 */
export function isAdminRole(role: string): boolean {
  return role === "Admin";
}

/**
 * Check if a role is Developer
 */
export function isDeveloperRole(role: string): boolean {
  return role === "Developer";
}
