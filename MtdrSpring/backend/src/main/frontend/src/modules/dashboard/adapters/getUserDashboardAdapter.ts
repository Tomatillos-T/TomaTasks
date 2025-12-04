import type { DashboardResponse } from "../models/dashboard";

export default async function getUserDashboardAdapter(
  sprintId?: string
): Promise<DashboardResponse> {
  const token = localStorage.getItem("jwtToken");

  const url = sprintId
    ? `/api/dashboard/user?sprintId=${sprintId}`
    : "/api/dashboard/user";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching user dashboard: ${response.statusText}`);
  }

  return response.json();
}
