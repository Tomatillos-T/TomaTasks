import { useMutation, useQueryClient } from "@tanstack/react-query";
import createTaskAdapter, { type CreateTaskParams } from "@/modules/task/adapters/createTaskAdapter";

export interface TaskFormParams {
  name: string;
  description: string;
  timeEstimate: number;
  status: string;
  userId: string;
  sprintId?: string;
}

export default function useTaskForm() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (params: TaskFormParams) => {
      const adapterParams: CreateTaskParams = {
        name: params.name,
        description: params.description,
        timeEstimate: params.timeEstimate,
        assigneeId: params.userId,
        sprintId: params.sprintId,
      };
      return await createTaskAdapter(adapterParams);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const createTask = async (params: TaskFormParams) => {
    const result = await createMutation.mutateAsync(params);
    if (result.status !== 200) {
      throw new Error(result.message);
    }
    return {
      name: params.name,
      message: result.message,
    };
  };

  return {
    createTask,
    isCreating: createMutation.isPending,
    isError: createMutation.isError,
    error: createMutation.error,
  };
}
