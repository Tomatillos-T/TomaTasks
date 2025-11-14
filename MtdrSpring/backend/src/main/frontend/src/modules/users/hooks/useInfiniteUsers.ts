import { useQuery } from "@tanstack/react-query";
import getUsersAdapter from "../adapters/getUsersAdapter";

export default function useInfiniteUsers() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", "all"],
    queryFn: getUsersAdapter,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    users: data?.data ?? [],
    isLoading,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: () => {},
    error,
  };
}
