import type GeneralResponse from "@/models/generalResponse";
import type { User } from "@/modules/users/models/user";

export default async function deleteUserAdapter(
  id: string
): Promise<GeneralResponse<User | null>> {
  try {
    const response = await fetch(`/api/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const user: User = await response.json();

    return {
      data: user,
      message: "Usuario eliminado exitosamente",
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: (error as Error).message || "Error al eliminar usuario",
      status: 500,
    };
  }
}
