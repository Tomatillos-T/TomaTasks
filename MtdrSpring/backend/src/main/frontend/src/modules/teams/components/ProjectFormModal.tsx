// teams/components/ProjectFormModal.tsx
import React from "react"
import Modal from "../../../components/Modal"
import Input from "../../../components/Input"
import Textarea from "../../../components/TextArea"
import Select from "../../../components/Select"
import Button from "../../../components/Button"
import Alert from "../../../components/Alert"
import type { ProjectFormData, SubmitStatus } from "../hooks/useProjectModalForm"

interface Props {
  isOpen: boolean
  onClose: () => void
  projectFormData: ProjectFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: () => void
  isSubmittingProject: boolean
  projectSubmitStatus: SubmitStatus
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  projectFormData,
  onChange,
  onSubmit,
  isSubmittingProject,
  projectSubmitStatus,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="+"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmittingProject}>Cancelar</Button>
          <Button variant="primary" onClick={onSubmit} loading={isSubmittingProject} disabled={isSubmittingProject}>Guardar</Button>
        </>
      }
    >
      {projectSubmitStatus.type && <Alert type={projectSubmitStatus.type} message={projectSubmitStatus.message} />}
      <Input label="Nombre del proyecto" name="name" value={projectFormData.name} onChange={onChange} required disabled={isSubmittingProject} />
      <Textarea label="Descripción" name="description" value={projectFormData.description} onChange={onChange} disabled={isSubmittingProject} rows={3} />
      <Select label="Estado" name="status" value={projectFormData.status} onChange={onChange} disabled={isSubmittingProject} options={[
        { label: "Planning", value: "planning" },
        { label: "In Progress", value: "in-progress" },
        { label: "On Hold", value: "on-hold" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ]} />
      <Input label="Fecha de inicio" type="date" name="startDate" value={projectFormData.startDate} onChange={onChange} required disabled={isSubmittingProject} />
      <Input label="Fecha de entrega" type="date" name="deliveryDate" value={projectFormData.deliveryDate} onChange={onChange} disabled={isSubmittingProject} />
    </Modal>
  )
}
