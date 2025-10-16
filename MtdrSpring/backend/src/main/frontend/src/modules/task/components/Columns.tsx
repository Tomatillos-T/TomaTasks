import type { ColumnDef, TableMeta } from "@tanstack/react-table";
import type Task from "../models/task";

interface TaskTableMeta extends TableMeta<Task> {
  removeRow: (id: string) => Promise<void>;
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: "Tarea",
  },
  {
    accessorKey: "estimation",
    header: "Estimacion (hrs)",
  },
  {
    accessorKey: "asignee",
    header: "Asignado a",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "sprint",
    header: "Sprint",
  },
  {
    accessorKey: "startDate",
    header: "Fecha de Inicio",
  },
  {
    accessorKey: "endDate",
    header: "Terminado en",
  },
  {
    accessorKey: "deliveryDate",
    header: "Fecha de Entrega",
  },
  {
    accessorKey: "userStory",
    header: "Historia de Usuario",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const task = row.original;
      const meta = table.options.meta as TaskTableMeta;
      console.log(task, meta);
      return "No hay libreria de componentes :)";
    },
  },
];
