import type Task from "../models/task";
import type { TaskDTO } from "../models/taskDTO";
import type PaginationParams from "../../../models/paginatedParams";
import type PaginationResponse from "../../../models/paginationResponse";
import type GeneralResponse from "../../../models/generalResponse";
import type JPAPaginatedResponse from "../../../models/JPAPaginatedResponse";
import { mapTaskDTOsToTasks } from "../utils/taskMapper";
import {
  mapFiltersToBackend,
  mapSortingToBackend,
} from "../utils/columnMapper";

export default async function getTasksAdapter({
  page,
  pageSize,
  search,
  filters,
  sorting,
}: PaginationParams): Promise<GeneralResponse<PaginationResponse<Task[]>>> {
  try {
    // Map frontend column names to backend property names
    const mappedFilters = mapFiltersToBackend(filters);
    const mappedSorting = mapSortingToBackend(sorting);

    const response: JPAPaginatedResponse<TaskDTO[]> = await fetch(
      "/api/tasks/search",
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
          filters: mappedFilters,
          sorting: mappedSorting,
        }),
      }
    ).then((res) => {
      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.status}`);
      }
      return res.json();
    });

    // Map backend DTOs to frontend Task models
    const tasks = mapTaskDTOsToTasks(response.content);

    return {
      data: {
        items: tasks,
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
