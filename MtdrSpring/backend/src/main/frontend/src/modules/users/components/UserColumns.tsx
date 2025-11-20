import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/modules/users/models/user";
import { UserRole, roleLabels } from "@/modules/users/models/user";
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
        [UserRole.Admin]: "done",
        [UserRole.Developer]: "pending",
      };

      return <Badge variant={variantMap[role] || "default"}>{roleLabels[role]}</Badge>;
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
