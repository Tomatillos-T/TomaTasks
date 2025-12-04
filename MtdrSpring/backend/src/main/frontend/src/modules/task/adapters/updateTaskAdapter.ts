import type { TaskDTO } from "@/modules/task/models/taskDTO";
import type GeneralResponse from "@/models/generalResponse";

interface UpdateTaskData {
  name: string;
  description: string;
  timeEstimate: number;
  timeTaken: number;
  status: string;
  priority?: string;
  estimation?: string;
  assigneeId?: string;
  sprintId?: string;
}

export default async function updateTaskAdapter(
  id: string,
  taskData: UpdateTaskData
): Promise<GeneralResponse<TaskDTO | null>> {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
      body: JSON.stringify(taskData),
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
      data: null,
      message: (error as Error).message || "Error updating task",
      status: 500,
    };
  }
}
