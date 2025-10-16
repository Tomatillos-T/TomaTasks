import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  Updater,
} from "@tanstack/react-table";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { columns } from "../components/Columns";
import type Task from "../models/task";
import { ResponseStatus } from "../../../models/responseStatus";
import getTasksAdapter from "../adapters/getTasksAdapter";
import deleteTaskAdapter from "../adapters/deleteTaskAdapter";

interface useTasksResult {
  status: ResponseStatus;
  data: Task[];
  total: number;
  table: ReturnType<typeof useReactTable<Task>>;
  searchInput: string;
  setSearchInput: (value: string) => void;
  error: Error | null;
}

export default function useTasks(): useTasksResult {
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
  } = useQuery({
    queryKey: ["tasks", queryVariables],
    queryFn: async () => {
      const response = await getTasksAdapter(queryVariables);
      return response;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isPending) {
      setStatus(ResponseStatus.PENDING);
    } else if (isError) {
      setStatus(ResponseStatus.ERROR);
    } else if (tasks && tasks.data.items.length === 0) {
      setStatus(ResponseStatus.EMPTY);
    } else {
      setStatus(ResponseStatus.SUCCESS);
    }
  }, [isPending, isError, tasks]);

  const pageCount = useMemo(() => {
    return tasks
      ? Math.max(Math.ceil(tasks.data.total / pagination.pageSize), 1)
      : 1;
  }, [tasks, pagination.pageSize]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchInput);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      return await deleteTaskAdapter({ id });
    },
    onSuccess: (data, id) => {
      console.log("Task deleted successfully:", data);
      if (tasks && tasks.data) {
        tasks.data.items = tasks.data.items.filter((task) => task.id !== id);
      }
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
    },
  });

  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService.mutateAsync(serviceId);
    } catch (error) {
      console.error("Error deleting task:", error);
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
    enableSortingRemoval: false,
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
  };
}
