// projects/components/ProjectFormFields.tsx
import type React from "react"
import Input from "../../../components/Input"
import Textarea from "../../../components/TextArea"
import Select from "../../../components/Select"
import Button from "../../../components/Button"
import Alert from "../../../components/Alert"
import type { ProjectFormData } from "../hooks/useProjectForm"
import type { Team } from "../services/teamService"

interface Props {
  formData: ProjectFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  teams: Team[]
  isLoadingTeams: boolean
  isSubmitting: boolean
  tempProjectId: string | null
  isCreatingProjectForTeam: boolean
  submitStatus: { type: "success" | "error" | null; message: string }
  onCreateTeamClick: () => void
  resetForm: () => void
}

export default function ProjectFormFields({
  formData,
  onChange,
  teams,
  isLoadingTeams,
  isSubmitting,
  tempProjectId,
  isCreatingProjectForTeam,
  submitStatus,
  onCreateTeamClick,
  resetForm,
}: Props) {
  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold text-text-primary">Información del Proyecto</h2>
        <p className="text-sm text-text-secondary">
          Complete los datos del proyecto a continuación.
          {tempProjectId && " (Proyecto guardado - puedes agregar más información)"}
        </p>
      </div>

      {submitStatus.type && <Alert type={submitStatus.type} message={submitStatus.message} />}

      <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Nombre del Proyecto"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            disabled={isSubmitting || !!tempProjectId}
            placeholder="Ingrese el nombre del proyecto"
          />
        </div>

        <div className="sm:col-span-2">
          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={onChange}
            required
            disabled={isSubmitting || !!tempProjectId}
            placeholder="Describa el proyecto..."
            rows={4}
          />
        </div>

        <div className="sm:col-span-2">
          <Select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={onChange}
            required
            disabled={isSubmitting || !!tempProjectId}
            options={[
              { label: "En planificación", value: "planning" },
              { label: "En progreso", value: "in-progress" },
              { label: "En pausa", value: "on-hold" },
              { label: "Completado", value: "completed" },
              { label: "Cancelado", value: "cancelled" },
            ]}
          />
        </div>

        <div className="sm:col-span-2">
          {isLoadingTeams ? (
            <Select
              label="Equipo Asignado"
              name="teamId"
              value=""
              onChange={onChange}
              disabled
              options={[{ label: "Cargando equipos...", value: "" }]}
            />
          ) : (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Select
                  label="Equipo Asignado (Opcional)"
                  name="teamId"
                  value={formData.teamId}
                  onChange={onChange}
                  disabled={isSubmitting}
                  options={[
                    { label: "Sin equipo", value: "" },
                    ...teams.map(team => ({ label: team.name, value: team.id })),
                  ]}
                />
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={onCreateTeamClick}
                disabled={isSubmitting || isCreatingProjectForTeam}
                loading={isCreatingProjectForTeam}
              >
                {tempProjectId ? "Crear otro equipo" : "+"}
              </Button>
            </div>
          )}
          {!tempProjectId && (
            <p className="text-xs text-text-secondary mt-1">
              * Para crear un equipo nuevo, el proyecto se guardará automáticamente primero
            </p>
          )}
        </div>

        <Input
          label="Fecha de Inicio"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={onChange}
          required
          disabled={isSubmitting || !!tempProjectId}
        />
        <Input
          label="Fecha de Entrega"
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={onChange}
          disabled={isSubmitting || !!tempProjectId}
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-4">
        <Button type="button" variant="secondary" onClick={resetForm} disabled={isSubmitting}>
          {tempProjectId ? "Nuevo Proyecto" : "Reiniciar"}
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
          {tempProjectId ? "Finalizar" : "Guardar Proyecto"}
        </Button>
      </div>
    </>
  )
}
