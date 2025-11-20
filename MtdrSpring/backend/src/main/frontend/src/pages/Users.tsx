import { useMemo } from "react";
import { DataTableAdvanced } from "@/components/DataTable/DataTableAdvanced";
import { ResponseStatus } from "@/models/responseStatus";
import Button from "@/components/Button";
import { type User, UserRole, roleLabels } from "@/modules/users/models/user";
import useUsers from "@/modules/users/hooks/useUsers";
import { columns } from "@/modules/users/components/UserColumns";
import type { FilterData } from "@/components/DataTable/types";
import { UserRole } from "@/modules/users/models/user";

export default function Users() {
  const { status, table, searchInput, setSearchInput, isRefetching } = useUsers();

  const filters: FilterData[] = useMemo(
    () => [
      {
        accessorKey: "firstName",
        header: "Nombre",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      { accessorKey: "email", header: "Correo" },
      { accessorKey: "phoneNumber", header: "Teléfono" },
      {
        accessorKey: "role",
        header: "Rol",
        cell: ({ row }) => roleLabels[row.original.role] || row.original.role,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-2 justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingUser(row.original);
                setIsModalOpen(true);
              }}
              className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4 text-text-secondary" />
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (confirm(`¿Eliminar al usuario ${row.original.firstName}?`)) {
                  await deleteUser(row.original.id);
                }
              }}
              className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-error-main" />
            </button>
          </div>
        ),
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
