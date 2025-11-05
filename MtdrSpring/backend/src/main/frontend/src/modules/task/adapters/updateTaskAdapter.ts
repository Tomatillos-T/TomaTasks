import type { TaskDTO } from "@/modules/task/models/taskDTO";
import type GeneralResponse from "@/models/generalResponse";

interface UpdateTaskParams {
  id: string;
  taskDTO: TaskDTO;
}

export default async function updateTaskAdapter({
  id,
  taskDTO,
}: UpdateTaskParams): Promise<GeneralResponse<TaskDTO>> {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
      body: JSON.stringify(taskDTO),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const data: TaskDTO = await response.json();

    return {
      data,
      message: "Task updated successfully",
      status: 200,
    };
  } catch (error) {
    return {
      data: null as unknown as TaskDTO,
      message: (error as Error).message || "Error updating task",
      status: 500,
    };
  }
}
