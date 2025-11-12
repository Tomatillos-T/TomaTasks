import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getUsersAdapter from "@/modules/users/adapters/getUsersAdapter";
import createUserAdapter, { type CreateUserParams } from "@/modules/users/adapters/createUserAdapter";
import updateUserAdapter, { type UpdateUserParams } from "@/modules/users/adapters/updateUserAdapter";
import deleteUserAdapter from "@/modules/users/adapters/deleteUserAdapter";
import type { User } from "@/modules/users/models/user";

export default function useUsers() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersAdapter,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: createUserAdapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUserAdapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserAdapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const createUser = async (params: CreateUserParams): Promise<User | null> => {
    const result = await createMutation.mutateAsync(params);
    if (result.status !== 200) throw new Error(result.message);
    return result.data;
  };

  const updateUser = async (params: UpdateUserParams): Promise<User | null> => {
    const result = await updateMutation.mutateAsync(params);
    if (result.status !== 200) throw new Error(result.message);
    return result.data;
  };

  const deleteUser = async (id: string): Promise<User | null> => {
    const result = await deleteMutation.mutateAsync(id);
    if (result.status !== 200) throw new Error(result.message);
    return result.data;
  };

  return {
    users: data?.data || [],
    isLoading,
    isError,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
