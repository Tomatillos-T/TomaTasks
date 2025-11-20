import type { DeveloperMetricData } from "../models/charts";

export default async function getHoursByDeveloperSprintAdapter(): Promise<
  DeveloperMetricData[]
> {
  const token = localStorage.getItem("jwtToken");

  const response = await fetch(
    "/api/dashboard/charts/hours-by-developer-sprint",
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
      `Error fetching hours by developer: ${response.statusText}`
    );
  }

  return response.json();
}
