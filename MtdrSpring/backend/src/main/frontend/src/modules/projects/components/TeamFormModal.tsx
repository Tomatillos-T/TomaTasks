// projects/components/TeamFormModal.tsx
import type React from "react"
import Modal from "../../../components/Modal"
import Input from "../../../components/Input"
import Textarea from "../../../components/TextArea"
import Select from "../../../components/Select"
import Button from "../../../components/Button"
import Alert from "../../../components/Alert"
import type { TeamFormData } from "../hooks/useTeamForm"

interface Props {
  isOpen: boolean
  onClose: () => void
  teamFormData: TeamFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: () => void
  isSubmittingTeam: boolean
  teamSubmitStatus: { type: "success" | "error" | null; message: string }
}

export default function TeamFormModal({
  isOpen,
  onClose,
  teamFormData,
  onChange,
  onSubmit,
  isSubmittingTeam,
  teamSubmitStatus,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Equipo"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmittingTeam}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onSubmit} loading={isSubmittingTeam} disabled={isSubmittingTeam}>
            Guardar Equipo
          </Button>
        </>
      }
    >
      {teamSubmitStatus.type && <Alert type={teamSubmitStatus.type} message={teamSubmitStatus.message} />}

      <div className="space-y-4">
        <Input
          label="Nombre del Equipo"
          name="name"
          value={teamFormData.name}
          onChange={onChange}
          required
          disabled={isSubmittingTeam}
          placeholder="Nombre del equipo"
        />
        <Textarea
          label="Descripción"
          name="description"
          value={teamFormData.description}
          onChange={onChange}
          disabled={isSubmittingTeam}
          placeholder="Descripción del equipo"
          rows={3}
        />
        <Select
          label="Estado"
          name="status"
          value={teamFormData.status}
          onChange={onChange}
          disabled={isSubmittingTeam}
          options={[
            { label: "Activo", value: "active" },
            { label: "Inactivo", value: "inactive" },
          ]}
        />
      </div>
    </Modal>
  )
}
