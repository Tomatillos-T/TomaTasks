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
export async function getProjects(): Promise<Project[]> {
  return HttpClient.get<Project[]>("/api/projects", { auth: true });
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  return HttpClient.post<Project>("/api/projects", payload, { auth: true });
}
