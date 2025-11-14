import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/modules/users/models/user";
import { UserRole } from "@/modules/users/models/user";
import Badge, { type BadgeProps } from "@/components/Badge";
import type { UserTableMeta } from "@/modules/users/models/userTableMeta";
import { UserColumnDropDown } from "@/modules/users/components/UserColumnDropDown";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Nombre",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: "email",
    header: "Correo Electrónico",
  },
  {
    accessorKey: "phoneNumber",
    header: "Teléfono",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.original.role;

      const variantMap: Record<UserRole, BadgeProps["variant"]> = {
        [UserRole.ROLE_ADMIN]: "done",
        [UserRole.ROLE_DEVELOPER]: "pending",
      };

      const labelMap: Record<UserRole, string> = {
        [UserRole.ROLE_ADMIN]: "Administrador",
        [UserRole.ROLE_DEVELOPER]: "Desarrollador",
      };

      return <Badge variant={variantMap[role] || "default"}>{labelMap[role]}</Badge>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as UserTableMeta;

      return <UserColumnDropDown user={user} meta={meta} />;
    },
  },
];
