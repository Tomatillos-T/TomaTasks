import type { TaskReportData } from "../models/charts";

export default async function getLastSprintTasksReportAdapter(): Promise<
  TaskReportData[]
> {
  const token = localStorage.getItem("jwtToken");

  const response = await fetch(
    "/api/dashboard/charts/last-sprint-tasks-report",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching last sprint tasks report: ${response.statusText}`
    );
  }

  return response.json();
}
