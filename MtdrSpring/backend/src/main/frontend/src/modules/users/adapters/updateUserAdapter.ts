import type GeneralResponse from "@/models/generalResponse";
import type { User, UserRole } from "@/modules/users/models/user";
import { mapRoleToBackend, mapRoleToFrontend } from "@/utils/roleMapper";

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

    // Map frontend role to backend format before sending
    const backendBody = body.role
      ? { ...body, role: mapRoleToBackend(body.role as string) }
      : body;

    const response = await fetch(`/api/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
      body: JSON.stringify(backendBody),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const user: User = await response.json();

    // Map backend role to frontend format in response
    const mappedUser = {
      ...user,
      role: mapRoleToFrontend(user.role) as any,
    };

    return {
      data: mappedUser,
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
