import type Task from "../models/task";
import type PaginationParams from "../../../models/paginatedParams";
import type PaginationResponse from "../../../models/paginationResponse";
import type GeneralResponse from "../../../models/generalResponse";
import type JPAPaginatedResponse from "../../../models/JPAPaginatedResponse";

export default async function getTasksAdapter({
  page,
  pageSize,
  search,
  filters,
  sorting,
}: PaginationParams): Promise<GeneralResponse<PaginationResponse<Task[]>>> {
  try {
    const response: JPAPaginatedResponse<Task[]> = await fetch(
      "api/tasks/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
        },
        body: JSON.stringify({
          page: page - 1,
          pageSize,
          search,
          filters,
          sorting,
        }),
      }
    ).then((res) => {
      console.log(res);
      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.status}`);
      }
      return res.json();
    });

    return {
      data: {
        items: response.items,
        total: response.totalElements,
      },
      message: "Tasks fetched successfully",
      status: 200,
    };
  } catch (error) {
    return {
      data: {
        items: [],
        total: 0,
      },
      message: (error as Error).message || "Error fetching tasks",
      status: 500,
    };
  }
}
