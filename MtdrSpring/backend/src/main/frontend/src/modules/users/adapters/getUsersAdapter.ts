import type GeneralResponse from "@/models/generalResponse";

export interface User {
  id: string;
  name: string;
  email?: string;
}

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

    return {
      data: users,
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
