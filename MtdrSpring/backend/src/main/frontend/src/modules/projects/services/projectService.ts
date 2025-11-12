import { HttpClient } from "../../../services/httpClient";
import type { HttpError } from "../../../services/httpClient";

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
  return HttpClient.post<Project>("/api/projects", payload, { auth:true });
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await HttpClient.get<unknown>("/api/projects", { auth: true });

    if (Array.isArray(res)) {
      return res as Project[];
    }

    if (res && typeof res === "object") {
      const maybe = (res as any).data ?? (res as any).projects;
      if (Array.isArray(maybe)) return maybe as Project[];
    }

    return [];
  } catch (error) {
    const err = error as HttpError;
    throw { message: err?.message ?? "Error fetching projects", status: err?.status ?? 500 };
  }
}

export async function updateProject(id: string, payload: CreateProjectPayload): Promise<Project> {
  return HttpClient.put<Project>(`/api/projects/${id}`, payload, { auth: true });
}


export async function deleteProject(id: string): Promise<void> {
  return HttpClient.delete<void>(`/api/projects/${id}`, { auth:true });
}

