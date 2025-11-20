import type { DeveloperMetricData } from "../models/charts";

export default async function getTasksByDeveloperSprintAdapter(): Promise<
  DeveloperMetricData[]
> {
  const token = localStorage.getItem("jwtToken");

  const response = await fetch(
    "/api/dashboard/charts/tasks-by-developer-sprint",
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
      `Error fetching tasks by developer: ${response.statusText}`
    );
  }

  return response.json();
}
