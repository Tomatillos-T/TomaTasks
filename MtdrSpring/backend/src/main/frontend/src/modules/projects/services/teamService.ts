// projects/services/teamService.ts
import { HttpClient } from "../../../services/httpClient";

export type TeamStatus = "active" | "inactive";

export interface Team {
  id: string;
  name: string;
  description?: string;
  status?: TeamStatus;
  projectId?: string;
}

export interface CreateTeamPayload {
  name: string;
  description?: string;
  status: TeamStatus;
  projectId?: string;
}

export async function getTeams(): Promise<Team[]> {
  return HttpClient.get<Team[]>("/api/teams", { auth: true });
}

export async function createTeam(payload: CreateTeamPayload): Promise<Team> {
  return HttpClient.post<Team>("/api/teams", payload, { auth: true });
}
