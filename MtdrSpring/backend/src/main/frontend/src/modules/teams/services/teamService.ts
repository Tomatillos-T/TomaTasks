// teams/services/teamService.ts
import { HttpClient } from "../../../services/httpClient";
import type { HttpError } from "../../../services/httpClient";

export enum TeamStatusEnum {
  ACTIVO = "ACTIVO",
  INACTIVO = "INACTIVO",
}

export const TeamStatusLabel: Record<TeamStatusEnum, string> = {
  [TeamStatusEnum.ACTIVO]: "Activo",
  [TeamStatusEnum.INACTIVO]: "Inactivo",
};

export const TeamStatusBadge: Record<TeamStatusEnum, "success" | "error"> = {
  [TeamStatusEnum.ACTIVO]: "success",
  [TeamStatusEnum.INACTIVO]: "error",
};

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: 'ROLE_DEVELOPER' | 'ROLE_ADMIN';
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  status: TeamStatusEnum;
  projectId?: string;
  members?: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamPayload {
  name: string;
  description: string;
  status: TeamStatusEnum;
  projectId?: string;
}


export type TeamStatus = "ACTIVO" | "INACTIVO";

export async function getTeams(): Promise<Team[]> {
  try {
    const response = await HttpClient.get<Team[]>("/api/teams", { auth: true });

    return response.map(team => ({
      ...team,
      status: team.status in TeamStatusEnum ? team.status as TeamStatusEnum : TeamStatusEnum.INACTIVO,
    }));

  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}

export async function getTeamsWithoutProject(): Promise<Team[]> {
  try {
    const response = await HttpClient.get<Team[]>("/api/teams/without-project", { auth: true });

    return response.map(team => ({
      ...team,
      status: team.status in TeamStatusEnum ? team.status as TeamStatusEnum : TeamStatusEnum.INACTIVO,
    }));

  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}

export async function getTeamById(id: string): Promise<Team> {
  try {
    return await HttpClient.get<Team>(`/api/teams/${id}`, { auth: true });
  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  try {
    const members = await HttpClient.get<TeamMember[]>(
      `/api/teams/${teamId}/members`, 
      { auth: true }
    );
    return Array.isArray(members) ? members : [];
  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}

export async function createTeam(payload: CreateTeamPayload): Promise<Team> {
  try {
    return await HttpClient.post<Team>("/api/teams", payload, { auth: true });
  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}

export async function updateTeam(id: string, payload: Partial<CreateTeamPayload>): Promise<Team> {
  try {
    return await HttpClient.put<Team>(`/api/teams/${id}`, payload, { auth: true });
  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}

export async function deleteTeam(id: string): Promise<void> {
  try {
    await HttpClient.delete(`/api/teams/${id}`, { auth: true });
  } catch (error) {
    const err = error as HttpError;
    throw { message: err.message, status: err.status };
  }
}