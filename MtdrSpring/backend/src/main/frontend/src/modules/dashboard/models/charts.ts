/**
 * TypeScript interfaces for dashboard chart data
 * Matches backend DTOs for chart endpoints
 */

export interface SprintHoursData {
  sprintId: string;
  sprintName: string;
  totalHours: number;
}

export interface DeveloperMetricData {
  developerId: string;
  developerName: string;
  metricsBySprint: Record<string, number>; // Key: sprintName, Value: hours or tasks count
}

export interface TaskReportData {
  taskId: string;
  taskName: string;
  developerName: string;
  estimatedHours: number | null;
  actualHours: number | null;
  status: string;
}
