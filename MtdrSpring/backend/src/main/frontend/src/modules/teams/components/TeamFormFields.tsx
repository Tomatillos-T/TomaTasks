// teams/components/TeamFormFields.tsx
import React from "react"
import Input from "../../../components/Input"
import Textarea from "../../../components/TextArea"
import Select from "../../../components/Select"
import Button from "../../../components/Button"
import type { TeamFormData } from "../hooks/useTeamForm"
import type { ProjectOption } from "../hooks/useProjectModalForm"

interface Props {
  formData: TeamFormData
  projects: ProjectOption[]
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onOpenProjectModal: () => void
  isSubmitting: boolean
}

export default function TeamFormFields({ formData, projects, onChange, onOpenProjectModal, isSubmitting }: Props) {
  return (
    <>
      <Input label="Nombre del equipo" name="name" value={formData.name} onChange={onChange} required disabled={isSubmitting} placeholder="Escribe el nombre del equipo" />
      <Select label="Estado" name="status" value={formData.status} onChange={onChange} disabled={isSubmitting} options={[
        { label: "Activo", value: "active" },
        { label: "Inactivo", value: "inactive" },
      ]} />
      <div className="flex flex-col gap-2">
        <Select label="Proyecto" name="projectId" value={formData.projectId} onChange={onChange} disabled={isSubmitting} options={projects} />
        <Button type="button" variant="primary" onClick={onOpenProjectModal}>Crear Nuevo Proyecto</Button>
      </div>
      <Textarea label="Descripción" name="description" value={formData.description} onChange={onChange} disabled={isSubmitting} placeholder="Descripción del equipo..." rows={4} />
    </>
  )
}
