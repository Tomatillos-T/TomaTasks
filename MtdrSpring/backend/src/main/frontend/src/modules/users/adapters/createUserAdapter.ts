import type GeneralResponse from "@/models/generalResponse";
import type { User, UserRole } from "@/modules/users/models/user";
import { mapRoleToBackend, mapRoleToFrontend } from "@/utils/roleMapper";

export interface CreateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: UserRole;
  teamId?: string;
}

export default async function createUserAdapter(
  params: CreateUserParams
): Promise<GeneralResponse<User | null>> {
  try {
    // Map frontend role to backend format before sending
    const backendParams = {
      ...params,
      role: mapRoleToBackend(params.role as string),
    };

    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
      body: JSON.stringify(backendParams),
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
