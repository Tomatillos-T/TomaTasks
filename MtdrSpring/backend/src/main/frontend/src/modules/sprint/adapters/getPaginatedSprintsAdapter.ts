interface Sprint {
  id: string;
  description: string;
}

interface PaginatedResponse<T> {
  data: T[];
  nextPage: number | null;
  hasMore: boolean;
}

const PAGE_SIZE = 10;

// In-memory cache to simulate pagination
let cachedSprints: Sprint[] | null = null;

export default async function getPaginatedSprintsAdapter(
  page: number = 0
): Promise<PaginatedResponse<Sprint>> {
  try {
    // If we don't have cached data, fetch from API
    if (!cachedSprints) {
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

      cachedSprints = await response.json();
    }

    // Simulate pagination by slicing the cached data
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedData = (cachedSprints || []).slice(startIndex, endIndex);
    const hasMore = endIndex < (cachedSprints || []).length;

    return {
      data: paginatedData,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    };
  } catch (error) {
    console.error("Error al obtener sprints:", error);
    return {
      data: [],
      nextPage: null,
      hasMore: false,
    };
  }
}

// Function to clear cache (useful when data changes)
export function clearSprintsCache() {
  cachedSprints = null;
}
