import { useMemo } from "react";
import { DataTableAdvanced } from "@/components/DataTable/DataTableAdvanced";
import useUsers from "@/modules/users/hooks/useUsers";
import { columns } from "@/modules/users/components/UserColumns";
import type { FilterData } from "@/components/DataTable/types";
import { UserRole } from "@/modules/users/models/user";

export default function Users() {
  const { status, table, searchInput, setSearchInput, isRefetching } = useUsers();

  const filters: FilterData[] = useMemo(
    () => [
      {
        column: "role",
        title: "Rol",
        data: Object.values(UserRole).map((role) => ({
          label: role === UserRole.ROLE_ADMIN ? "Administrador" : "Desarrollador",
          value: role,
        })),
      },
    ],
    []
  );

  return (
    <div className="h-full flex flex-col p-6 min-h-0">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-text-primary">Usuarios</h1>
      </div>
      <div className="flex-1 min-h-0 relative">
        <DataTableAdvanced
          columns={columns}
          table={table}
          status={status}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          filters={filters}
          isRefetching={isRefetching}
        />
      </div>
    </div>
  );
}