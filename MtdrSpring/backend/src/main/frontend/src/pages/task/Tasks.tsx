import { useMemo } from "react";
import useTasks from "../../modules/task/hooks/useTasks";
import { columns } from "../../modules/task/components/Columns";
import { DataTableAdvanced } from "../../components/DataTable/DataTableAdvanced";
import type { FilterData } from "../../components/DataTable/types";
import { TaskStatus } from "../../modules/task/models/taskStatus";

export default function Tasks() {
  const { status, table, searchInput, setSearchInput } = useTasks();

  const filters: FilterData[] = useMemo(
    () => [
      {
        column: "status",
        title: "Estado",
        data: Object.values(TaskStatus).map((status) => ({
          label: status,
          value: status,
        })),
      },
    ],
    []
  );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Tareas</h1>
      <DataTableAdvanced
        columns={columns}
        table={table}
        status={status}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
      />
    </div>
  );
}
