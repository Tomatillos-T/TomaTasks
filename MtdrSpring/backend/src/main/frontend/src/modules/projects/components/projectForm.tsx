import { useState, useEffect } from "react"
import type React from "react"
import Input from "../../../components/Input"
import Textarea from "../../../components/TextArea"
import Select from "../../../components/Select"
import Button from "../../../components/Button"
import Alert from "../../../components/Alert"
import Modal from "../../../components/Modal"

type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled"
type TeamStatus = "active" | "inactive"

interface Team {
  id: string
  name: string
}

interface ProjectFormData {
  name: string
  description: string
  status: ProjectStatus
  startDate: string
  deliveryDate: string
  endDate: string
  teamId: string
}

interface TeamFormData {
  name: string
  description: string
  status: TeamStatus
}

interface ApiError {
  message: string
  status?: number
}

export default function ProjectForm() {
  const API_BASE_URL = "http://localhost:8080"

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "planning",
    startDate: "",
    deliveryDate: "",
    endDate: "",
    teamId: "",
  })

  const [teams, setTeams] = useState<Team[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" })

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [teamFormData, setTeamFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    status: "active",
  })
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false)
  const [teamSubmitStatus, setTeamSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" })

  // Obtener equipos disponibles
  const fetchTeams = async () => {
    setIsLoadingTeams(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/teams`)
      if (!response.ok) {
        throw new Error(`Error al obtener equipos: ${response.status}`)
      }
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error(error)
      setTeams([])
    } finally {
      setIsLoadingTeams(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  // Manejo de cambios en formulario de proyecto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Manejo de cambios en formulario de equipo
  const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTeamFormData(prev => ({ ...prev, [name]: value }))
  }

  // Reset formulario de proyecto
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "planning",
      startDate: "",
      deliveryDate: "",
      endDate: "",
      teamId: "",
    })
  }

  // Reset formulario de equipo
  const resetTeamForm = () => {
    setTeamFormData({ name: "", description: "", status: "active" })
    setTeamSubmitStatus({ type: null, message: "" })
  }

  // Crear proyecto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        startDate: formData.startDate,
        deliveryDate: formData.deliveryDate || null,
        endDate: formData.endDate || null,
        team: formData.teamId ? { id: formData.teamId } : null,
      }

      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw { message: errorData.message || `Error del servidor: ${response.status}`, status: response.status } as ApiError
      }

      const createdProject = await response.json()
      setSubmitStatus({ type: "success", message: `Proyecto "${createdProject.name}" creado correctamente.` })
      setTimeout(() => { resetForm(); setSubmitStatus({ type: null, message: "" }) }, 3000)
    } catch (error) {
      const apiError = error as ApiError
      setSubmitStatus({ type: "error", message: apiError.message || "No se pudo crear el proyecto." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Crear equipo desde modal
  const handleCreateTeam = async () => {
    setIsSubmittingTeam(true)
    setTeamSubmitStatus({ type: null, message: "" })

    try {
      const payload = { ...teamFormData }
      const response = await fetch(`${API_BASE_URL}/api/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw { message: errorData.message || `Error del servidor: ${response.status}`, status: response.status } as ApiError
      }

      const createdTeam: Team = await response.json()
      setTeamSubmitStatus({ type: "success", message: `Equipo "${createdTeam.name}" creado.` })
      setFormData(prev => ({ ...prev, teamId: createdTeam.id }))
      fetchTeams()
      setTimeout(() => { setIsTeamModalOpen(false); resetTeamForm() }, 1500)
    } catch (error) {
      const apiError = error as ApiError
      setTeamSubmitStatus({ type: "error", message: apiError.message || "No se pudo crear el equipo." })
    } finally {
      setIsSubmittingTeam(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-background-default">
      <form onSubmit={handleSubmit} className="max-w-3xl w-full space-y-8 p-8 bg-background-paper rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Información del Proyecto</h2>
          <p className="text-sm text-text-secondary">Complete los datos del proyecto a continuación.</p>
        </div>

        {submitStatus.type && <Alert type={submitStatus.type} message={submitStatus.message} />}

        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Nombre del Proyecto" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} placeholder="Ingrese el nombre del proyecto" />
          </div>

          <div className="sm:col-span-2">
            <Textarea label="Descripción" name="description" value={formData.description} onChange={handleChange} required disabled={isSubmitting} placeholder="Describa el proyecto..." rows={4} />
          </div>

          <div className="sm:col-span-2">
            <Select
              label="Estado"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={isSubmitting}
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
              <Select label="Equipo Asignado" name="teamId" value="" onChange={handleChange} disabled options={[{ label: "Cargando equipos...", value: "" }]} />
            ) : teams.length === 0 ? (
              <div>
                <p className="text-text-secondary mb-2">No hay equipos disponibles.</p>
                <Button type="button" variant="primary" onClick={() => setIsTeamModalOpen(true)}>Crear nuevo equipo</Button>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Select
                    label="Equipo Asignado"
                    name="teamId"
                    value={formData.teamId}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    options={teams.map(team => ({ label: team.name, value: team.id }))}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsTeamModalOpen(true)}
                  disabled={isSubmitting}
                >
                  +
                </Button>
              </div>
            )}
          </div>

          <Input label="Fecha de Inicio" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required disabled={isSubmitting} />
          <Input label="Fecha de Entrega" type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} disabled={isSubmitting} />
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-4">
          <Button type="button" variant="secondary" onClick={resetForm} disabled={isSubmitting}>Resetear</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>Guardar Proyecto</Button>
        </div>
      </form>

      {/* Modal para crear equipo */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title="Crear Nuevo Equipo"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsTeamModalOpen(false)} disabled={isSubmittingTeam}>Cancelar</Button>
            <Button variant="primary" onClick={handleCreateTeam} loading={isSubmittingTeam} disabled={isSubmittingTeam}>Guardar</Button>
          </>
        }
      >
        {teamSubmitStatus.type && <Alert type={teamSubmitStatus.type} message={teamSubmitStatus.message} />}
        <Input label="Nombre del Equipo" name="name" value={teamFormData.name} onChange={handleTeamChange} required disabled={isSubmittingTeam} placeholder="Nombre del equipo" />
        <Textarea label="Descripción" name="description" value={teamFormData.description} onChange={handleTeamChange} disabled={isSubmittingTeam} placeholder="Descripción del equipo" rows={3} />
        <Select label="Estado" name="status" value={teamFormData.status} onChange={handleTeamChange} disabled={isSubmittingTeam} options={[
          { label: "Activo", value: "active" },
          { label: "Inactivo", value: "inactive" },
        ]} />
      </Modal>
    </section>
  )
}
