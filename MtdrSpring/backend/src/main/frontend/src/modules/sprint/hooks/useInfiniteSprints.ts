import { useInfiniteQuery } from "@tanstack/react-query";
import getPaginatedSprintsAdapter from "../adapters/getPaginatedSprintsAdapter";

export default function useInfiniteSprints() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["sprints", "infinite"],
    queryFn: ({ pageParam = 0 }) => getPaginatedSprintsAdapter(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Flatten all pages into a single array
  const sprints = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    sprints,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    error,
  };
}
