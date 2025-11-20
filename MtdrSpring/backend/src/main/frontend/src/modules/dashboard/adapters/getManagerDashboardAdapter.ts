import type { DashboardResponse } from "../models/dashboard";

export default async function getManagerDashboardAdapter(
  sprintId?: string
): Promise<DashboardResponse> {
  const token = localStorage.getItem("jwtToken");

  const url = sprintId
    ? `/api/dashboard/manager?sprintId=${sprintId}`
    : "/api/dashboard/manager";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error fetching manager dashboard: ${response.statusText}`
    );
  }

  return response.json();
}
