import type { ColumnDef } from "@tanstack/react-table";
import type Task from "@/modules/task/models/task";
import { TaskStatus } from "@/modules/task/models/taskStatus";
import Badge, { type BadgeProps } from "@/components/Badge";
import type { TaskTableMeta } from "@/modules/task/models/taskTableMeta";
import { ColumnDropDownMenu } from "@/modules/task/components/ColumnDropDown";
import {
  priorityLabels,
  priorityColors,
  estimationLabels,
  estimationColors,
} from "@/modules/task/models/taskEnums";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: "Tarea",
  },
  {
    accessorKey: "timeEstimate",
    header: "Estimación (hrs)",
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => {
      const priority = row.original.priority;
      if (!priority) return <span className="text-text-secondary">-</span>;

      const colors = priorityColors[priority];
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
        >
          {priorityLabels[priority]}
        </span>
      );
    },
  },
  {
    accessorKey: "estimation",
    header: "Complejidad",
    cell: ({ row }) => {
      const estimation = row.original.estimation;
      if (!estimation) return <span className="text-text-secondary">-</span>;

      const colors = estimationColors[estimation];
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
        >
          {estimationLabels[estimation]}
        </span>
      );
    },
  },
  {
    accessorKey: "timeTaken",
    header: "Tiempo Real (hrs)",
    cell: ({ row }) => {
      const timeTaken = row.original.timeTaken;
      const timeEstimate = row.original.timeEstimate;

      if (timeTaken === null || timeTaken === undefined) {
        return <span className="text-gray-400">-</span>;
      }

      const isOverBudget = timeEstimate && timeTaken > timeEstimate;
      return (
        <span className={isOverBudget ? "text-red-600 font-semibold" : ""}>
          {timeTaken}
        </span>
      );
    },
  },
  {
    accessorKey: "assignee.name",
    header: "Asignado a",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;

      const variantMap: Record<TaskStatus, BadgeProps["variant"]> = {
        [TaskStatus.DONE]: "done",
        [TaskStatus.INPROGRESS]: "inprogress",
        [TaskStatus.PENDING]: "pending",
        [TaskStatus.TODO]: "todo",
        [TaskStatus.TESTING]: "testing",
      };

      return <Badge variant={variantMap[status] || "default"}>{status}</Badge>;
    },
  },
  {
    accessorKey: "sprint.name",
    header: "Sprint",
  },
  {
    accessorKey: "startDate",
    header: "Fecha de Inicio",
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      return startDate ? new Date(startDate).toLocaleDateString() : "N/A";
    },
  },
  {
    accessorKey: "endDate",
    header: "Terminado en",
    cell: ({ row }) => {
      const endDate = row.original.endDate;
      return endDate ? new Date(endDate).toLocaleDateString() : "N/A";
    },
  },
  {
    accessorKey: "deliveryDate",
    header: "Fecha de Entrega",
    cell: ({ row }) => {
      const deliveryDate = row.original.deliveryDate;
      return deliveryDate ? new Date(deliveryDate).toLocaleDateString() : "N/A";
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const task = row.original;
      const meta = table.options.meta as TaskTableMeta;

      return (
        <ColumnDropDownMenu task={task} meta={meta} onEdit={meta?.onEdit} />
      );
    },
  },
];
