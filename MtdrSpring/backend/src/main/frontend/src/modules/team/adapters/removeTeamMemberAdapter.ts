// removeTeamMemberAdapter.ts
import { HttpClient } from "@/services/httpClient";

export interface RemoveTeamMemberParams {
  teamId: string;
  userId: string;
}

export default async function removeTeamMemberAdapter(params: RemoveTeamMemberParams) {
  try {
    await HttpClient.delete(
      `/api/teams/${params.teamId}/members/${params.userId}`,
      { auth: true }
    );
    
    return {
      status: 200,
      data: null,
      message: "Miembro removido exitosamente"
    };
  } catch (error: any) {
    return {
      status: error.status || 500,
      data: null,
      message: error.message || "Error al remover miembro"
    };
  }
}