import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getUsersAdapter from "@/modules/users/adapters/getUsersAdapter";
import createUserAdapter, { type CreateUserParams } from "@/modules/users/adapters/createUserAdapter";

export default function useUsers() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersAdapter,
    staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
    gcTime: 10 * 60 * 1000, // Mantener en caché por 10 minutos
    refetchOnMount: false, // No refetch si hay datos en caché
    refetchOnWindowFocus: false, // No refetch al volver a la ventana
  });

  const createMutation = useMutation({
    mutationFn: createUserAdapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const createUser = async (params: CreateUserParams) => {
    const result = await createMutation.mutateAsync(params);
    if (result.status !== 200) {
      throw new Error(result.message);
    }
    return result.data;
  };

  return {
    users: data?.data || [],
    isLoading,
    isError,
    error,
    createUser,
    isCreating: createMutation.isPending,
  };
}
