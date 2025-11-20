import type { SprintHoursData } from "../models/charts";

export default async function getTotalHoursBySprintAdapter(): Promise<
  SprintHoursData[]
> {
  const token = localStorage.getItem("jwtToken");

  const response = await fetch("/api/dashboard/charts/total-hours-by-sprint", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error fetching total hours by sprint: ${response.statusText}`
    );
  }

  return response.json();
}
