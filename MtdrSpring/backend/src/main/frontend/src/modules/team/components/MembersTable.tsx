import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/DropdownMenu";
import type { TeamMember } from "../models/team";

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "firstName",
    header: "Nombre",
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      const lastName = row.getValue("lastName") as string;
      return (
        <div>
          <div className="font-medium">{`${firstName} ${lastName}`}</div>
          <div className="text-sm text-text-secondary">{row.original.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: "Apellido",
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableHiding: true,
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "ROLE_ADMIN" ? "error" : "secondary"}>
          {role === "ROLE_ADMIN" ? "Admin" : "Developer"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  // Aquí iría la lógica para editar el rol
                  console.log("Editar rol", row.original);
                }}
              >
                Cambiar rol
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => {
                  // Aquí iría la lógica para remover al miembro
                  console.log("Remover miembro", row.original);
                }}
              >
                Remover del equipo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];