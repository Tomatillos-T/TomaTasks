/**
 * Filter value transformation strategies
 *
 * Single Responsibility: Each mapper handles one specific type of value transformation
 * Open/Closed Principle: Easy to add new mappers without modifying existing ones
 * Dependency Inversion: Main code depends on the ValueMapper type, not concrete implementations
 */

import { UserRole } from "@/modules/users/models/user";

/**
 * Interface for value mapper strategies
 * This allows for easy extension and follows the Dependency Inversion Principle
 */
export type ValueMapper = (value: unknown) => unknown;

/**
 * Maps role enum values from frontend to backend format
 *
 * @param value - Array of role values or single role value
 * @returns Transformed value(s) for backend consumption
 */
export const mapRoleValue: ValueMapper = (value: unknown): unknown => {
  if (!Array.isArray(value)) {
    return value;
  }

  return value.map((role) => {
    // Check if it's a UserRole enum value
    if (Object.values(UserRole).includes(role as UserRole)) {
      return role; // Roles are already in the correct format
    }
    return role;
  });
};

/**
 * Identity mapper - returns value unchanged
 * Useful as a default when no transformation is needed
 */
export const identityMapper: ValueMapper = (value: unknown): unknown => value;

/**
 * Registry of value mappers for different column types
 * Open/Closed Principle: Add new mappers here without modifying existing code
 */
export const VALUE_MAPPERS: Record<string, ValueMapper> = {
  role: mapRoleValue,
  // Add more column-specific mappers here as needed
};

/**
 * Gets the appropriate value mapper for a column
 *
 * @param columnId - The column identifier
 * @returns The value mapper function for the column, or identity mapper if none exists
 */
export function getValueMapper(columnId: string): ValueMapper {
  return VALUE_MAPPERS[columnId] || identityMapper;
}
