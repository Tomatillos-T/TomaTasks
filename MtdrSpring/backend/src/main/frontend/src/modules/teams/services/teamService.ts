// teams/services/teamService.ts
const API_BASE_URL = "http://localhost:8080"

export type TeamStatus = "active" | "inactive"

export interface Team {
  id: string
  name: string
  description?: string
  status: TeamStatus
  projectId?: string
}

export interface CreateTeamPayload {
  name: string
  description: string
  status: TeamStatus
  projectId: string
}

export interface ApiError {
  message: string
  status?: number
}

export async function createTeam(payload: CreateTeamPayload): Promise<Team> {
  const resp = await fetch(`${API_BASE_URL}/api/teams`, {
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
