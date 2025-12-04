import type GeneralResponse from "@/models/generalResponse";
import type { User } from "@/modules/users/models/user";

export default async function getUsersWithoutTeamAdapter(): Promise<GeneralResponse<User[]>> {
  try {
    const response = await fetch("/api/user/without-team", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const users: User[] = await response.json();

    return {
      data: users,
      message: "Usuarios sin equipo obtenidos exitosamente",
      status: 200,
    };
  } catch (error) {
    console.error("Error al obtener usuarios sin equipo:", error);
    return {
      data: [],
      message: (error as Error).message || "Error al obtener usuarios sin equipo",
      status: 500,
    };
  }
}
