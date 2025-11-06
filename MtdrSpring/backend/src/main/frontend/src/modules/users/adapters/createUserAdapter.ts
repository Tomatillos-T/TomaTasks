import type GeneralResponse from "@/models/generalResponse";
import type { User } from "@/modules/users/adapters/getUsersAdapter";

export interface CreateUserParams {
  name: string;
  email: string;
}

export default async function createUserAdapter(
  params: CreateUserParams
): Promise<GeneralResponse<User | null>> {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const user: User = await response.json();

    return {
      data: user,
      message: "Usuario creado exitosamente",
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: (error as Error).message || "Error al crear usuario",
      status: 500,
    };
  }
}
