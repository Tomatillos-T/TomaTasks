import type { TableMeta } from "@tanstack/react-table";
import type Task from "../models/task";

export interface TaskTableMeta extends TableMeta<Task> {
  removeRow: (id: string) => Promise<void>;
}
