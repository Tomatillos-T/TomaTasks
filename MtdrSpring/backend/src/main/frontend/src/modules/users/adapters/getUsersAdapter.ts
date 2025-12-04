import type GeneralResponse from "@/models/generalResponse";
import type { User } from "@/modules/users/models/user";
import { mapRoleToFrontend } from "@/utils/roleMapper";

export default async function getUsersAdapter(): Promise<GeneralResponse<User[]>> {
  try {
    const response = await fetch("/api/user", {
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

    // Map backend role format to frontend format
    const mappedUsers = users.map(user => ({
      ...user,
      role: mapRoleToFrontend(user.role) as any,
    }));

    return {
      data: mappedUsers,
      message: "Usuarios obtenidos exitosamente",
      status: 200,
    };
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return {
      data: [],
      message: (error as Error).message || "Error al obtener usuarios",
      status: 500,
    };
  }
}
