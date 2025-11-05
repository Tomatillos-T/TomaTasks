import type GeneralResponse from "../../../models/generalResponse";
import type { TaskDTO } from "../models/taskDTO";
import { mapTaskDTOToTask } from "../utils/taskMapper";

export interface CreateTaskParams {
  name: string;
  description?: string;
  timeEstimate?: number;
  assigneeId?: string;
  sprintId?: string;
  userStoryId?: string;
}

export default async function createTaskAdapter(
  params: CreateTaskParams
): Promise<GeneralResponse<string | null>> {
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
      body: JSON.stringify({
        name: params.name,
        description: params.description || "",
        timeEstimate: params.timeEstimate || 0,
        status: "TODO",
        assigneeId: params.assigneeId,
        sprintId: params.sprintId,
        userStoryId: params.userStoryId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const taskDTO: TaskDTO = await response.json();
    const task = mapTaskDTOToTask(taskDTO);

    return {
      data: task.id,
      message: "Tarea creada exitosamente",
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: (error as Error).message || "Error al crear la tarea",
      status: 500,
    };
  }
}
