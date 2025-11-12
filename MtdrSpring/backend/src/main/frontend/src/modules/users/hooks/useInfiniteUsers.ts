import { useInfiniteQuery } from "@tanstack/react-query";
import getPaginatedUsersAdapter from "@/modules/users/adapters/getPaginatedUsersAdapter";
import type { User } from "@/modules/users/models/user";

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

  // Aplanar todas las páginas en un solo arreglo
  const users: User[] = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    users,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    error,
  };
}
