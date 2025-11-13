import { useMutation, useQueryClient } from "@tanstack/react-query";
import removeTeamMemberAdapter, {
  type RemoveTeamMemberParams,
} from "../../team/adapters/removeTeamMemberAdapter";

export default function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeTeamMemberAdapter,
    onSuccess: (_, variables) => {
      // Actualiza los datos del equipo afectado
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
      // Refresca la lista de usuarios sin equipo
      queryClient.invalidateQueries({ queryKey: ["users", "withoutTeam"] });
    },
  });

  const removeMember = async (params: RemoveTeamMemberParams) => {
    const result = await mutation.mutateAsync(params);
    if (result.status !== 200) throw new Error(result.message);
    return result.data;
  };

  return {
    removeMember,
    isRemoving: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
