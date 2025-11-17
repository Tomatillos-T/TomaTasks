/**
 * Configuration for column name mappings between frontend and backend
 *
 * Single Responsibility: This file only contains configuration data
 */

/**
 * Maps frontend User model property names to backend DTO property names
 */
export const COLUMN_MAPPING: Record<string, string> = {
  // User properties
  id: "id",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  phoneNumber: "phoneNumber",
  role: "role",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

/**
 * List of columns that require special value transformation
 */
export const TRANSFORMABLE_COLUMNS = {
  ROLE: "role",
} as const;
