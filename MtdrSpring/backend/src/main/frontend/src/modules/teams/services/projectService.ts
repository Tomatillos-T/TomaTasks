// teams/services/projectService.ts
import { HttpClient } from "../../../services/httpClient";
import type { HttpError } from "../../../services/httpClient";

export type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  deliveryDate?: string;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  deliveryDate?: string;
}

export async function getProjects(): Promise<Project[]> {
  try {
    return await HttpClient.get<Project[]>("/api/projects", { auth: true });
  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}


export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  try {
    return await HttpClient.post<Project>("/api/projects", payload, { auth: true });
  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}
