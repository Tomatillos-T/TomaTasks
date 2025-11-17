import React from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { type User, UserRole } from "@/modules/users/models/user";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  editingUser: User | null;
}

export default function UserForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  editingUser,
}: UserFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? "Editar Usuario" : "Crear Usuario"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
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
                {role === UserRole.ROLE_ADMIN
                  ? "Administrador"
                  : "Desarrollador"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {editingUser ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
