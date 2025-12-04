import { useQuery } from "@tanstack/react-query";
import getUsersWithoutTeamAdapter from "../../team/adapters/getUsersWithoutTeamAdapter";

export default function useUsersWithoutTeam() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", "withoutTeam"],
    queryFn: getUsersWithoutTeamAdapter,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    usersWithoutTeam: data?.data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
