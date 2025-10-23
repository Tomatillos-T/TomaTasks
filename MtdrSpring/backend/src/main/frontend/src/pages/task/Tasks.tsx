import { useMemo, useState } from "react";
import useTasks from "../../modules/task/hooks/useTasks";
import { columns } from "../../modules/task/components/Columns";
import { DataTableAdvanced } from "../../components/DataTable/DataTableAdvanced";
import type { FilterData } from "../../components/DataTable/types";
import { TaskStatus } from "../../modules/task/models/taskStatus";
import Button from "../../components/Button";
import { Plus } from "lucide-react";
import CreateTaskModal from "../../modules/task/components/CreateTaskModal";

export default function Tasks() {
  const { status, table, searchInput, setSearchInput } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-text-primary">Tareas</h1>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Crear Tarea
        </Button>
      </div>
      <DataTableAdvanced
        columns={columns}
        table={table}
        status={status}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
      />
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
