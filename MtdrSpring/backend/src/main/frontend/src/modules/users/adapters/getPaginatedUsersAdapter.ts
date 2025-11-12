import type { User } from "@/modules/users/models/user";

interface PaginatedResponse<T> {
  data: T[];
  nextPage: number | null;
  hasMore: boolean;
}

const PAGE_SIZE = 10;
let cachedUsers: User[] | null = null;

export default async function getPaginatedUsersAdapter(
  page: number = 0
): Promise<PaginatedResponse<User>> {
  try {
    if (!cachedUsers) {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      cachedUsers = await response.json();
    }

    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedData = (cachedUsers || []).slice(startIndex, endIndex);
    const hasMore = endIndex < (cachedUsers || []).length;

    return {
      data: paginatedData,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    };
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return {
      data: [],
      nextPage: null,
      hasMore: false,
    };
  }
}

export function clearUsersCache() {
  cachedUsers = null;
}
