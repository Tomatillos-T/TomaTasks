export interface KpiData {
  onTimeCompletionRate: number;
  incompleteTasks: number;
  lateDeliveries: number;
  avgHoursByEstimation: Record<string, number>;
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  onTimeTasks: number;
  totalInvestedHours: number;
  totalExpectedHours: number;
  avgExpectedHoursByEstimation: Record<string, number>;
}

export interface DashboardResponse {
  kpis: KpiData;
  scope: "user" | "manager";
  userId?: string;
  sprintId?: string | null;
  sprintName: string;
  previousSprintKpis?: KpiData | null;
}
