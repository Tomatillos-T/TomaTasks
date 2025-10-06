// teams/services/projectService.ts
const API_BASE_URL = "http://localhost:8080"

export type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled"

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  startDate?: string
  deliveryDate?: string
}

export interface CreateProjectPayload {
  name: string
  description: string
  status: ProjectStatus
  startDate: string
  deliveryDate?: string
}

export interface ApiError {
  message: string
  status?: number
}

export async function getProjects(): Promise<Project[]> {
  const resp = await fetch(`${API_BASE_URL}/api/projects`)
  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}))
    throw { message: errorData.message || `Error fetching projects: ${resp.status}`, status: resp.status } as ApiError
  }
  return resp.json()
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const resp = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}))
    throw { message: errorData.message || `Server error: ${resp.status}`, status: resp.status } as ApiError
  }
  return resp.json()
}
