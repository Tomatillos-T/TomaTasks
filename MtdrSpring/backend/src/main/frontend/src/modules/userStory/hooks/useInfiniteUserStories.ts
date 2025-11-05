import { useInfiniteQuery } from "@tanstack/react-query";
import getPaginatedUserStoriesAdapter from "../adapters/getPaginatedUserStoriesAdapter";

export default function useInfiniteUserStories() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["userStories", "infinite"],
    queryFn: ({ pageParam = 0 }) => getPaginatedUserStoriesAdapter(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Flatten all pages into a single array
  const userStories = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    userStories,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    error,
  };
}
