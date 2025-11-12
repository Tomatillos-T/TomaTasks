import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import type Task from "@/modules/task/models/task";
import { TaskStatus } from "@/modules/task/models/taskStatus";
import getTasksAdapter from "@/modules/task/adapters/getTasksAdapter";
import updateTaskAdapter from "@/modules/task/adapters/updateTaskAdapter";
import { mapStatusToBackend } from "@/modules/task/utils/taskMapper";

interface TaskPage {
  data: {
    items: Task[];
    total: number;
  };
}

interface InfiniteTaskData {
  pages: TaskPage[];
  pageParams: unknown[];
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
}

export interface UseKanbanResult {
  columns: KanbanColumn[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  // Drag & drop handlers
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, fromStatus: TaskStatus) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, toStatus: TaskStatus) => void;
}

const PAGE_SIZE = 10;

export default function useKanban(): UseKanbanResult {
  const queryClient = useQueryClient();

  // Create infinite query for each status
  const useColumnQuery = (status: TaskStatus) => {
    return useInfiniteQuery({
      queryKey: ["kanban-tasks", status],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await getTasksAdapter({
          page: pageParam,
          pageSize: PAGE_SIZE,
          search: "",
          filters: [
            {
              id: "status",
              value: [mapStatusToBackend(status)], // Backend expects array of strings
            },
          ],
          sorting: [],
        });
        return response;
      },
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = allPages.length;
        const totalPages = Math.ceil(lastPage.data.total / PAGE_SIZE);
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
    });
  };

  // Create queries for all statuses
  const todoQuery = useColumnQuery(TaskStatus.TODO);
  const inProgressQuery = useColumnQuery(TaskStatus.INPROGRESS);
  const testingQuery = useColumnQuery(TaskStatus.TESTING);
  const doneQuery = useColumnQuery(TaskStatus.DONE);

  // Mutation to update task status with optimistic updates
  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      task,
    }: {
      taskId: string;
      task: Task;
    }) => {
      // Convert Task to TaskDTO format for backend
      const taskDTO = {
        id: task.id,
        name: task.name,
        description: task.description,
        timeEstimate: task.estimation,
        status: mapStatusToBackend(task.status),
        startDate: task.startDate ? task.startDate.toISOString() : null,
        endDate: task.endDate ? task.endDate.toISOString() : null,
        deliveryDate: task.deliveryDate ? task.deliveryDate.toISOString() : null,
        userStoryId: task.userStory?.id || null,
        sprintId: task.sprint?.id || null,
        assigneeId: task.assignee?.id || null,
        assigneeName: task.assignee?.name || null,
        sprintName: task.sprint?.name || null,
        userStoryName: task.userStory?.name || null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return await updateTaskAdapter({ id: taskId, taskDTO });
    },
    onMutate: ({ taskId, task }) => {
      // Cancel any outgoing refetches (synchronous to avoid delay)
      queryClient.cancelQueries({ queryKey: ["kanban-tasks"] });

      // Find old status by searching all columns
      let oldStatus: TaskStatus | null = null;
      let oldTask: Task | null = null;

      const statuses = [TaskStatus.TODO, TaskStatus.INPROGRESS, TaskStatus.TESTING, TaskStatus.DONE];
      for (const status of statuses) {
        const data = queryClient.getQueryData<InfiniteTaskData>(["kanban-tasks", status]);
        if (data?.pages) {
          for (const page of data.pages) {
            const foundTask = page.data.items.find((t: Task) => t.id === taskId);
            if (foundTask) {
              oldStatus = status;
              oldTask = foundTask;
              break;
            }
          }
        }
        if (oldTask) break;
      }

      if (!oldStatus || !oldTask) return { oldStatus: null, oldTask: null };

      // Snapshot the previous values for rollback
      const previousOldStatusData = queryClient.getQueryData(["kanban-tasks", oldStatus]);
      const previousNewStatusData = queryClient.getQueryData(["kanban-tasks", task.status]);

      // Optimistically update: remove from old column
      if (oldStatus !== task.status) {
        queryClient.setQueryData(["kanban-tasks", oldStatus], (old: InfiniteTaskData | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: TaskPage) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.filter((t: Task) => t.id !== taskId),
                total: page.data.total - 1,
              },
            })),
          };
        });

        // Optimistically update: add to new column (prepend to first page)
        queryClient.setQueryData(["kanban-tasks", task.status], (old: InfiniteTaskData | undefined) => {
          if (!old) return old;
          const updatedTask = { ...oldTask, status: task.status };
          return {
            ...old,
            pages: old.pages.map((page: TaskPage, index: number) => {
              if (index === 0) {
                // Add to first page
                return {
                  ...page,
                  data: {
                    ...page.data,
                    items: [updatedTask, ...page.data.items],
                    total: page.data.total + 1,
                  },
                };
              }
              return page;
            }),
          };
        });
      }

      // Return context with snapshot for rollback
      return {
        previousOldStatusData,
        previousNewStatusData,
        oldStatus,
        newStatus: task.status,
      };
    },
    onError: (error, _variables, context) => {
      console.error("Error updating task:", error);

      // Rollback optimistic update on error
      if (context?.oldStatus && context?.previousOldStatusData) {
        queryClient.setQueryData(["kanban-tasks", context.oldStatus], context.previousOldStatusData);
      }
      if (context?.newStatus && context?.previousNewStatusData) {
        queryClient.setQueryData(["kanban-tasks", context.newStatus], context.previousNewStatusData);
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      // After mutation (success or error), refetch affected columns only
      // This ensures data consistency with the server
      if (context?.oldStatus) {
        queryClient.invalidateQueries({ queryKey: ["kanban-tasks", context.oldStatus] });
      }
      if (context?.newStatus && context?.newStatus !== context?.oldStatus) {
        queryClient.invalidateQueries({ queryKey: ["kanban-tasks", context.newStatus] });
      }
    },
  });

  // Helper function to get all tasks from infinite query pages
  const getTasksFromQuery = useCallback((query: typeof todoQuery): Task[] => {
    if (!query.data) return [];
    return query.data.pages.flatMap((page) => page.data.items);
  }, []);

  // Build columns with their data
  const columns: KanbanColumn[] = useMemo(() => [
    {
      id: TaskStatus.TODO,
      title: "TODO",
      tasks: getTasksFromQuery(todoQuery),
      hasNextPage: todoQuery.hasNextPage ?? false,
      isFetchingNextPage: todoQuery.isFetchingNextPage,
      fetchNextPage: todoQuery.fetchNextPage,
      isLoading: todoQuery.isLoading,
    },
    {
      id: TaskStatus.INPROGRESS,
      title: "IN PROGRESS",
      tasks: getTasksFromQuery(inProgressQuery),
      hasNextPage: inProgressQuery.hasNextPage ?? false,
      isFetchingNextPage: inProgressQuery.isFetchingNextPage,
      fetchNextPage: inProgressQuery.fetchNextPage,
      isLoading: inProgressQuery.isLoading,
    },
    {
      id: TaskStatus.TESTING,
      title: "REVISION",
      tasks: getTasksFromQuery(testingQuery),
      hasNextPage: testingQuery.hasNextPage ?? false,
      isFetchingNextPage: testingQuery.isFetchingNextPage,
      fetchNextPage: testingQuery.fetchNextPage,
      isLoading: testingQuery.isLoading,
    },
    {
      id: TaskStatus.DONE,
      title: "DONE",
      tasks: getTasksFromQuery(doneQuery),
      hasNextPage: doneQuery.hasNextPage ?? false,
      isFetchingNextPage: doneQuery.isFetchingNextPage,
      fetchNextPage: doneQuery.fetchNextPage,
      isLoading: doneQuery.isLoading,
    },
  ], [todoQuery, inProgressQuery, testingQuery, doneQuery, getTasksFromQuery]);

  // Drag & drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedFromStatus, setDraggedFromStatus] = useState<TaskStatus | null>(null);

  // Function to move task to new status (internal use only)
  const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    // Find the task in all columns
    let task: Task | undefined;
    for (const column of columns) {
      task = column.tasks.find((t) => t.id === taskId);
      if (task) break;
    }

    if (!task) {
      console.error("Task not found:", taskId);
      return;
    }

    // Create updated task
    const updatedTask = { ...task, status: newStatus };

    // Perform the mutation
    try {
      await updateTaskMutation.mutateAsync({ taskId, task: updatedTask });
    } catch (error) {
      console.error("Error moving task:", error);
    }
  }, [columns, updateTaskMutation]);

  // Drag & drop handlers
  const handleDragStart = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
    fromStatus: TaskStatus
  ) => {
    setDraggedTaskId(taskId);
    setDraggedFromStatus(fromStatus);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(async (
    e: React.DragEvent<HTMLDivElement>,
    toStatus: TaskStatus
  ) => {
    e.preventDefault();

    if (!draggedTaskId || !draggedFromStatus) return;

    // Don't do anything if dropped in the same column
    if (draggedFromStatus === toStatus) {
      setDraggedTaskId(null);
      setDraggedFromStatus(null);
      return;
    }

    // Move the task to new status
    await moveTask(draggedTaskId, toStatus);

    // Reset drag state
    setDraggedTaskId(null);
    setDraggedFromStatus(null);
  }, [draggedTaskId, draggedFromStatus, moveTask]);

  // Check if any query is loading
  const isLoading =
    todoQuery.isLoading ||
    inProgressQuery.isLoading ||
    testingQuery.isLoading ||
    doneQuery.isLoading;

  // Check if any query has error
  const isError =
    todoQuery.isError ||
    inProgressQuery.isError ||
    testingQuery.isError ||
    doneQuery.isError;

  const error =
    todoQuery.error ||
    inProgressQuery.error ||
    testingQuery.error ||
    doneQuery.error;

  return {
    columns,
    isLoading,
    isError,
    error,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
}
