import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  Updater,
} from "@tanstack/react-table";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { columns } from "@/modules/task/components/Columns";
import type Task from "@/modules/task/models/task";
import { ResponseStatus } from "@/models/responseStatus";
import getTasksAdapter from "@/modules/task/adapters/getTasksAdapter";
import deleteTaskAdapter from "@/modules/task/adapters/deleteTaskAdapter";

interface useTasksResult {
  status: ResponseStatus;
  data: Task[];
  total: number;
  table: ReturnType<typeof useReactTable<Task>>;
  searchInput: string;
  setSearchInput: (value: string) => void;
  error: Error | null;
  isFetching: boolean;
  isRefetching: boolean;
}

export default function useTasks(): useTasksResult {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ResponseStatus>(ResponseStatus.PENDING);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Memoized query variables
  const queryVariables = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search,
      filters: columnFilters,
      sorting,
    }),
    [pagination.pageIndex, pagination.pageSize, search, columnFilters, sorting]
  );

  const {
    data: tasks,
    isPending,
    isError,
    error,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ["tasks", queryVariables],
    queryFn: async () => {
      const response = await getTasksAdapter(queryVariables);
      return response;
    },
    // Mantener datos previos durante transiciones para UX suave
    placeholderData: (previousData: any) => previousData,
    // Cache: datos frescos por 30 segundos
    staleTime: 30000,
    // Mantener datos en cache por 5 minutos
    gcTime: 5 * 60 * 1000,
    // No refetch automático al volver a la ventana
    refetchOnWindowFocus: false,
    // Solo refetch al montar si los datos están obsoletos
    refetchOnMount: true,
  });

  useEffect(() => {
    if (isPending) {
      setStatus(ResponseStatus.PENDING);
    } else if (isFetching && !tasks) {
      setStatus(ResponseStatus.PENDING);
    } else if (isError) {
      setStatus(ResponseStatus.ERROR);
    } else if (tasks && tasks.data.items.length === 0) {
      setStatus(ResponseStatus.EMPTY);
    } else {
      setStatus(ResponseStatus.SUCCESS);
    }
  }, [isPending, isFetching, isError, tasks]);

  const pageCount = useMemo(() => {
    return tasks
      ? Math.max(Math.ceil(tasks.data.total / pagination.pageSize), 1)
      : 1;
  }, [tasks, pagination.pageSize]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchInput);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      return await deleteTaskAdapter({ id });
    },
    // Optimistic update: actualizar cache inmediatamente
    onMutate: async (deletedId: string) => {
      // Cancelar refetches en curso para evitar sobrescribir nuestro update optimista
      await queryClient.cancelQueries({ queryKey: ["tasks", queryVariables] });

      // Snapshot del valor previo para rollback
      const previousTasks = queryClient.getQueryData(["tasks", queryVariables]);

      // Actualizar cache optimistamente
      queryClient.setQueryData(["tasks", queryVariables], (old: any) => {
        if (!old?.data?.items) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.filter((task: Task) => task.id !== deletedId),
            total: old.data.total - 1,
          },
        };
      });

      // Retornar contexto con snapshot para rollback si falla
      return { previousTasks };
    },
    // Si falla, revertir cambios optimistas
    onError: (_error, _deletedId, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", queryVariables], context.previousTasks);
      }
    },
    // Siempre sincronizar con el servidor después de completar
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService.mutateAsync(serviceId);
    } catch (error) {
      // El error ya se maneja en onError de la mutation
      // Solo propagamos para que el componente pueda manejarlo si es necesario
      throw error;
    }
  };

  const handleFilterChange = (updaterOrValue: Updater<ColumnFiltersState>) => {
    let filters: ColumnFiltersState;
    if (typeof updaterOrValue === "function") {
      filters = updaterOrValue(columnFilters);
    } else {
      filters = updaterOrValue;
    }

    setColumnFilters(filters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortChange = (updaterOrValue: Updater<SortingState>) => {
    let newSorting: SortingState;
    if (typeof updaterOrValue === "function") {
      newSorting = updaterOrValue(sorting);
    } else {
      newSorting = updaterOrValue;
    }
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const table = useReactTable({
    data: tasks ? tasks.data.items : [],
    columns: columns as ColumnDef<Task>[],
    state: { sorting, columnFilters, pagination },
    maxMultiSortColCount: 2,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount,
    onColumnFiltersChange: handleFilterChange,
    onSortingChange: handleSortChange,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      removeRow: handleDelete,
    },
  });

  return {
    status,
    data: tasks?.data.items || [],
    total: tasks?.data.total || 1,
    error,
    table,
    searchInput,
    setSearchInput,
    isFetching,
    isRefetching,
  };
}
