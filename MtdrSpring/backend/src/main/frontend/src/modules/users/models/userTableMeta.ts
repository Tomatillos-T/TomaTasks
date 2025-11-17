import type { TableMeta } from "@tanstack/react-table";
import type { User } from "@/modules/users/models/user";

export interface UserTableMeta extends TableMeta<User> {
  removeRow: (id: string) => Promise<void>;
}
