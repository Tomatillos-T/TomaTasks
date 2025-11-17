import type GeneralResponse from "@/models/generalResponse";

interface DeleteTaskParams {
  id: string;
}

export default async function deleteTaskAdapter({
  id,
}: DeleteTaskParams): Promise<GeneralResponse<null>> {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error in request: ${res.status}`);
      }
      return res.json();
    });

    return {
      data: null,
      message: "Task deleted successfully",
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      message: (error as Error).message || "Error deleting task",
      status: 500,
    };
  }
}
