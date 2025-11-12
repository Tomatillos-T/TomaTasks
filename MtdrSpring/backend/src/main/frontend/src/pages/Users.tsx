import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, type ColumnDef } from "@tanstack/react-table";
import { DataTableAdvanced } from "@/components/DataTable/DataTableAdvanced";
import { ResponseStatus } from "@/models/responseStatus";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import { type User, UserRole } from "@/modules/users/models/user";
import useUsers from "@/modules/users/hooks/useUsers";

export default function Users() {
  const { users, isLoading, createUser, updateUser, deleteUser, isCreating, isUpdating, isDeleting } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchInput.toLowerCase())
  );

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "firstName",
      header: "Nombre",
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    { accessorKey: "email", header: "Correo" },
    { accessorKey: "phoneNumber", header: "Teléfono" },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) =>
        row.original.role === UserRole.ROLE_ADMIN ? "Administrador" : "Desarrollador",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingUser(row.original);
              setIsModalOpen(true);
            }}
            className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4 text-text-secondary" />
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm(`¿Eliminar al usuario ${row.original.firstName}?`)) {
                await deleteUser(row.original.id);
              }
            }}
            className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-error-main" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as UserRole,
    };

    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id, ...payload });
      } else {
        await createUser(payload);
      }
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Usuarios</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Crear Usuario
        </Button>
      </div>

      <DataTableAdvanced
        columns={columns}
        table={table}
        status={isLoading ? ResponseStatus.PENDING : ResponseStatus.SUCCESS}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={[]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Editar Usuario" : "Crear Usuario"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              name="firstName"
              defaultValue={editingUser?.firstName}
              required
            />
            <Input
              label="Apellido"
              name="lastName"
              defaultValue={editingUser?.lastName}
              required
            />
          </div>
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            defaultValue={editingUser?.email}
            required
          />
          <Input
            label="Teléfono"
            name="phoneNumber"
            defaultValue={editingUser?.phoneNumber}
          />
          {!editingUser && (
            <Input label="Contraseña" name="password" type="password" required />
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              name="role"
              required
              defaultValue={editingUser?.role || UserRole.ROLE_DEVELOPER}
              className="w-full border rounded px-3 py-2"
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  {role === UserRole.ROLE_ADMIN ? "Administrador" : "Desarrollador"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingUser(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating || isDeleting}
            >
              {editingUser ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
