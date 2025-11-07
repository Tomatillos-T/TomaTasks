interface UserStory {
  id: string;
  name: string;
}

interface PaginatedResponse<T> {
  data: T[];
  nextPage: number | null;
  hasMore: boolean;
}

const PAGE_SIZE = 10;

// In-memory cache to simulate pagination
let cachedUserStories: UserStory[] | null = null;

export default async function getPaginatedUserStoriesAdapter(
  page: number = 0
): Promise<PaginatedResponse<UserStory>> {
  try {
    // If we don't have cached data, fetch from API
    if (!cachedUserStories) {
      const response = await fetch("/api/user-stories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      cachedUserStories = await response.json();
    }

    // Simulate pagination by slicing the cached data
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedData = (cachedUserStories || []).slice(startIndex, endIndex);
    const hasMore = endIndex < (cachedUserStories || []).length;

    return {
      data: paginatedData,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    };
  } catch (error) {
    console.error("Error al obtener historias de usuario:", error);
    return {
      data: [],
      nextPage: null,
      hasMore: false,
    };
  }
}

// Function to clear cache (useful when data changes)
export function clearUserStoriesCache() {
  cachedUserStories = null;
}
