// addTeamMemberAdapter.ts
import { HttpClient } from "@/services/httpClient";

export interface AddTeamMemberParams {
  teamId: string;
  userId: string;
}

export default async function addTeamMemberAdapter(params: AddTeamMemberParams) {
  try {
    // Cambia la ruta para incluir el userId en la URL
    const response = await HttpClient.post(
      `/api/teams/${params.teamId}/members/${params.userId}`,
      {}, // Body vacío porque los parámetros van en la URL
      { auth: true }
    );
    
    return {
      status: 200,
      data: response,
      message: "Miembro agregado exitosamente"
    };
  } catch (error: any) {
    return {
      status: error.status || 500,
      data: null,
      message: error.message || "Error al agregar miembro"
    };
  }
}