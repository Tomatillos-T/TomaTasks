import { useInfiniteQuery } from "@tanstack/react-query";
import getPaginatedUsersAdapter from "../adapters/getPaginatedUsersAdapter";

export default function useInfiniteUsers() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["users", "infinite"],
    queryFn: ({ pageParam = 0 }) => getPaginatedUsersAdapter(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Flatten all pages into a single array
  const users = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    users,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    error,
  };
}
