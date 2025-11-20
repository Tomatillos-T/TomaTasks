import { useMemo, useState } from "react";
import useTasks from "@/modules/task/hooks/useTasks";
import { columns } from "@/modules/task/components/Columns";
import { DataTableAdvanced } from "@/components/DataTable/DataTableAdvanced";
import type { FilterData } from "@/components/DataTable/types";
import { TaskStatus } from "@/modules/task/models/taskStatus";
import {
  TaskPriority,
  TaskEstimation,
  priorityLabels,
  estimationLabels,
} from "@/modules/task/models/taskEnums";
import Button from "@/components/Button";
import { Plus } from "lucide-react";
import CreateTaskModal from "@/modules/task/components/CreateTaskModal";
import type Task from "@/modules/task/models/task";

export default function Tasks() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseEditModal = () => {
    setEditingTask(null);
  };

  const { status, table, searchInput, setSearchInput, isRefetching } = useTasks({
    onEdit: handleEditTask,
  });

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
      {
        column: "priority",
        title: "Prioridad",
        data: Object.values(TaskPriority).map((priority) => ({
          label: priorityLabels[priority],
          value: priority,
        })),
      },
      {
        column: "estimation",
        title: "Complejidad",
        data: Object.values(TaskEstimation).map((estimation) => ({
          label: estimationLabels[estimation],
          value: estimation,
        })),
      },
    ],
    []
  );
  return (

    <div className="h-full flex flex-col p-6 min-h-0">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-text-primary">Tareas</h1>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Crear Tarea
        </Button>
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
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <CreateTaskModal
        isOpen={!!editingTask}
        onClose={handleCloseEditModal}
        task={editingTask}
      />
    </div>
  );
}
