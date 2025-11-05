interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  nextPage: number | null;
  hasMore: boolean;
}

const PAGE_SIZE = 10;

// In-memory cache to simulate pagination
let cachedUsers: User[] | null = null;

export default async function getPaginatedUsersAdapter(
  page: number = 0
): Promise<PaginatedResponse<User>> {
  try {
    // If we don't have cached data, fetch from API
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

    // Simulate pagination by slicing the cached data
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedData = cachedUsers.slice(startIndex, endIndex);
    const hasMore = endIndex < cachedUsers.length;

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

// Function to clear cache (useful when data changes)
export function clearUsersCache() {
  cachedUsers = null;
}
