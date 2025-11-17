import React from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { type Team, TeamStatusEnum, TeamStatusLabel } from "@/modules/teams/services/teamService";

interface TeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
  editingTeam?: Team | null;
}

export default function TeamForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  editingTeam,
}: TeamFormProps) {
  const isEdit = Boolean(editingTeam);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Editar Equipo" : "Crear Nuevo Equipo"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Nombre del Equipo"
          name="name"
          required
          placeholder="Ingrese el nombre del equipo"
          defaultValue={editingTeam?.name}
        />

        <TextArea
          label="Descripción"
          name="description"
          placeholder="Describa el propósito del equipo"
          rows={4}
          defaultValue={editingTeam?.description}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            name="status"
            required
            className="w-full border rounded px-3 py-2"
            defaultValue={editingTeam?.status || TeamStatusEnum.ACTIVO}
          >
            {Object.values(TeamStatusEnum).map((status) => (
              <option key={status} value={status}>
                {TeamStatusLabel[status]}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-error-main text-sm">{error}</div>}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEdit
                ? "Guardando..."
                : "Creando..."
              : isEdit
              ? "Guardar Cambios"
              : "Crear Equipo"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
