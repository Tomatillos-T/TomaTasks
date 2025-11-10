// projects/services/projectService.ts

import { HttpClient } from "../../../services/httpClient";

export type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled";

export interface CreateProjectPayload {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  deliveryDate?: string | null;
  endDate?: string | null;
  team?: { id: string } | null;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  deliveryDate?: string | null;
  endDate?: string | null;
  team?: { id: string } | null;
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  return HttpClient.post<Project>("/api/projects", payload);
}

export async function deleteProject(id: string): Promise<void> {
  return HttpClient.delete<void>(`/api/projects/${id}`);
}

