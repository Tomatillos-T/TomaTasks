import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { type Team } from "@/modules/teams/services/teamService";

interface TeamDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  team: Team | null;
  isSubmitting: boolean;
  error?: string | null;
}

export default function TeamDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  team,
  isSubmitting,
  error,
}: TeamDeleteModalProps) {
  if (!team) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Equipo">
      <div className="space-y-4">
        <p className="text-text-secondary">
          ¿Estás seguro de que deseas eliminar el equipo{" "}
          <span className="font-semibold text-text-primary">{team.name}</span>? Esta acción no se puede deshacer.
        </p>

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
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-error-main hover:bg-error-dark"
          >
            {isSubmitting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
