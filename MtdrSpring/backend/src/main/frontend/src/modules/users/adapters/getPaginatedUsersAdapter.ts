import type { User } from "@/modules/users/models/user";
import type PaginationParams from "@/models/paginatedParams";
import type PaginationResponse from "@/models/paginationResponse";
import type GeneralResponse from "@/models/generalResponse";
import type JPAPaginatedResponse from "@/models/JPAPaginatedResponse";
import {
  mapFiltersToBackend,
  mapSortingToBackend,
} from "@/modules/users/utils/columnMapper";
import { mapRoleToFrontend } from "@/utils/roleMapper";

export default async function getPaginatedUsersAdapter({
  page,
  pageSize,
  search,
  filters,
  sorting,
}: PaginationParams): Promise<GeneralResponse<PaginationResponse<User[]>>> {
  try {
    // Map frontend column names to backend property names
    const mappedFilters = mapFiltersToBackend(filters);
    const mappedSorting = mapSortingToBackend(sorting);

    const requestBody = {
      page: page - 1,
      pageSize,
      search,
      filters: mappedFilters,
      sorting: mappedSorting,
    };

    console.log("📤 Request to /api/user/search:", requestBody);

    const response: JPAPaginatedResponse<User[]> = await fetch(
      "/api/user/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
        },
        body: JSON.stringify(requestBody),
      }
    ).then((res) => {
      console.log("📥 Response status:", res.status);
      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.status}`);
      }
      return res.json();
    });

    console.log("📦 Parsed response:", response);

    // Map backend role format (ROLE_ADMIN) to frontend format (Admin)
    const mappedUsers = response.content.map((user) => ({
      ...user,
      role: mapRoleToFrontend(user.role) as User["role"],
    }));

    return {
      data: {
        items: mappedUsers,
        total: response.totalElements,
      },
      message: "Users fetched successfully",
      status: 200,
    };
  } catch (error) {
    console.error("💥 Error in getPaginatedUsersAdapter:", error);
    return {
      data: {
        items: [],
        total: 0,
      },
      message: (error as Error).message || "Error fetching users",
      status: 500,
    };
  }
}
