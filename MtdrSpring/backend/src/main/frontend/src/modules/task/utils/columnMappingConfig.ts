/**
 * Configuration for column name mappings between frontend and backend
 *
 * Single Responsibility: This file only contains configuration data
 */

/**
 * Maps frontend Task model property names to backend DTO property names
 */
export const COLUMN_MAPPING: Record<string, string> = {
  // Time and complexity estimations
  timeEstimate: "timeEstimate", // Frontend: hours (number) -> Backend: hours (Integer)
  estimation: "estimation", // Frontend: complexity (TaskEstimation) -> Backend: complexity (Estimation)
  timeTaken: "timeTaken", // Actual time taken
  priority: "priority", // Task priority
  assignee: "assigneeId",
  "assignee.name": "user.lastName", // Sort/filter by last name (more common convention)
  "assignee.id": "user.id",
  // TanStack Table converts dots to underscores in column IDs for sorting
  assignee_name: "user.lastName",
  assignee_id: "user.id",
  sprint: "sprintId",
  "sprint.name": "sprint.description", // For filtering/sorting by sprint name
  "sprint.id": "sprint.id",
  sprint_name: "sprint.description",
  sprint_id: "sprint.id",
  // Other properties remain the same
  id: "id",
  name: "name",
  description: "description",
  status: "status",
  startDate: "startDate",
  endDate: "endDate",
  deliveryDate: "deliveryDate",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

/**
 * List of columns that require special value transformation
 */
export const TRANSFORMABLE_COLUMNS = {
  STATUS: "status",
} as const;
