import type { ColumnDef } from "@tanstack/react-table";
import type Task from "../models/task";
import { TaskStatus } from "../models/taskStatus";
import Badge, { type BadgeProps } from "../../../components/Badge";
import type { TaskTableMeta } from "../models/taskTableMeta";
import { ColumnDropDownMenu } from "./ColumnDropDown";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: "Tarea",
  },
  {
    accessorKey: "estimation",
    header: "Estimación (hrs)",
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
        [TaskStatus.DONE]: "success",
        [TaskStatus.INPROGRESS]: "warning",
        [TaskStatus.PENDING]: "error",
        [TaskStatus.TODO]: "secondary",
        [TaskStatus.TESTING]: "default",
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

      return <ColumnDropDownMenu task={task} meta={meta} />;
    },
  },
];
