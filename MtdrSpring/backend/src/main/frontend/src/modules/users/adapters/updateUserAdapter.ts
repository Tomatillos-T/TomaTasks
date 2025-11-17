import type GeneralResponse from "@/models/generalResponse";
import type { User, UserRole } from "@/modules/users/models/user";

export interface UpdateUserParams {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  role?: UserRole;
  teamId?: string;
}

export default async function updateUserAdapter(
  params: UpdateUserParams
): Promise<GeneralResponse<User | null>> {
  try {
    const { id, ...body } = params;

    const response = await fetch(`/api/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const user: User = await response.json();

    return {
      data: user,
      message: "Usuario actualizado exitosamente",
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: (error as Error).message || "Error al actualizar usuario",
      status: 500,
    };
  }
}
