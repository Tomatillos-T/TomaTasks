import type GeneralResponse from "@/models/generalResponse";

export interface Sprint {
  id: string;
  name: string;
  description?: string;
}

export default async function getSprintsAdapter(): Promise<GeneralResponse<Sprint[]>> {
  try {
    const response = await fetch("/api/sprints", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const sprints: Sprint[] = await response.json();

    return {
      data: sprints,
      message: "Sprints obtenidos exitosamente",
      status: 200,
    };
  } catch (error) {
    return {
      data: [],
      message: (error as Error).message || "Error al obtener sprints",
      status: 500,
    };
  }
}
