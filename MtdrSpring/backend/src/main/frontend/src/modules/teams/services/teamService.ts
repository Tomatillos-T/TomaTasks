// teams/services/teamService.ts
import { HttpClient } from "../../../services/httpClient";
import type { HttpError } from "../../../services/httpClient";

export type TeamStatus = "active" | "inactive";

export interface Team {
  id: string;
  name: string;
  description?: string;
  status: TeamStatus;
  projectId?: string;
}

export interface CreateTeamPayload {
  name: string;
  description: string;
  status: TeamStatus;
  projectId: string;
}

export async function getTeams(): Promise<Team[]> {
  try {
    return await HttpClient.get<Team[]>("/api/teams", { auth: true });
  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}

export async function createTeam(payload: CreateTeamPayload): Promise<Team> {
  try {
    return await HttpClient.post<Team>("/api/teams", payload);
  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}
