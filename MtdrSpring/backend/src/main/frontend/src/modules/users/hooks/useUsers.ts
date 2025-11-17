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
import { columns } from "@/modules/users/components/UserColumns";
import type { User } from "@/modules/users/models/user";
import { ResponseStatus } from "@/models/responseStatus";
import getPaginatedUsersAdapter from "@/modules/users/adapters/getPaginatedUsersAdapter";
import deleteUserAdapter from "@/modules/users/adapters/deleteUserAdapter";

interface useUsersResult {
  status: ResponseStatus;
  data: User[];
  total: number;
  table: ReturnType<typeof useReactTable<User>>;
  searchInput: string;
  setSearchInput: (value: string) => void;
  error: Error | null;
  isFetching: boolean;
  isRefetching: boolean;
}

export default function useUsers(): useUsersResult {
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
    data: users,
    isPending,
    isError,
    error,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ["users", queryVariables],
    queryFn: async () => {
      console.log("🔍 Fetching users with params:", queryVariables);
      const response = await getPaginatedUsersAdapter(queryVariables);
      console.log("✅ Users response:", response);
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
    console.log("📊 Status Update:", { isPending, isFetching, isError, users, itemsCount: users?.data?.items?.length });
    if (isPending) {
      setStatus(ResponseStatus.PENDING);
    } else if (isFetching && !users) {
      setStatus(ResponseStatus.PENDING);
    } else if (isError) {
      console.error("❌ Error fetching users:", error);
      setStatus(ResponseStatus.ERROR);
    } else if (users && users.data.items.length === 0) {
      setStatus(ResponseStatus.EMPTY);
    } else {
      setStatus(ResponseStatus.SUCCESS);
    }
  }, [isPending, isFetching, isError, users, error]);

  const pageCount = useMemo(() => {
    return users
      ? Math.max(Math.ceil(users.data.total / pagination.pageSize), 1)
      : 1;
  }, [users, pagination.pageSize]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchInput);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      return await deleteUserAdapter(id);
    },
    // Optimistic update: actualizar cache inmediatamente
    onMutate: async (deletedId: string) => {
      // Cancelar refetches en curso para evitar sobrescribir nuestro update optimista
      await queryClient.cancelQueries({ queryKey: ["users", queryVariables] });

      // Snapshot del valor previo para rollback
      const previousUsers = queryClient.getQueryData(["users", queryVariables]);

      // Actualizar cache optimistamente
      queryClient.setQueryData(["users", queryVariables], (old: any) => {
        if (!old?.data?.items) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.filter((user: User) => user.id !== deletedId),
            total: old.data.total - 1,
          },
        };
      });

      // Retornar contexto con snapshot para rollback si falla
      return { previousUsers };
    },
    // Si falla, revertir cambios optimistas
    onError: (_error, _deletedId, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users", queryVariables], context.previousUsers);
      }
    },
    // Siempre sincronizar con el servidor después de completar
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleDelete = async (userId: string) => {
    try {
      await deleteService.mutateAsync(userId);
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
    data: users ? users.data.items : [],
    columns: columns as ColumnDef<User>[],
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
    data: users?.data.items || [],
    total: users?.data.total || 1,
    error,
    table,
    searchInput,
    setSearchInput,
    isFetching,
    isRefetching,
  };
}
