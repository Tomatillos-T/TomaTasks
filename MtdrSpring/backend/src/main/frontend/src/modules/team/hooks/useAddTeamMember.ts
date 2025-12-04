import { useMutation, useQueryClient } from "@tanstack/react-query";
import addTeamMemberAdapter, {
  type AddTeamMemberParams,
} from "../../team/adapters/addTeamMemberAdapter";

export default function useAddTeamMember() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTeamMemberAdapter,
    onSuccess: (_, variables) => {
      // Invalida los datos del equipo específico
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
      // Y también los usuarios sin equipo, si los usas
      queryClient.invalidateQueries({ queryKey: ["users", "withoutTeam"] });
    },
  });

  const addMember = async (params: AddTeamMemberParams) => {
    const result = await mutation.mutateAsync(params);
    if (result.status !== 200) throw new Error(result.message);
    return result.data;
  };

  return {
    addMember,
    isAdding: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
