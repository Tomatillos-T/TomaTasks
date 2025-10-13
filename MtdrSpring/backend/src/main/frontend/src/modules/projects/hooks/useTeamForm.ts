// projects/hooks/useTeamForm.ts
import { useState } from "react"
import { createTeam } from "../services/teamService"
import type { CreateTeamPayload, Team } from "../services/teamService"

export type TeamStatus = "active" | "inactive"

export interface TeamFormData {
  name: string
  description: string
  status: TeamStatus
  projectId: string
}

export type SubmitStatus = { type: "success" | "error" | null; message: string }

export function useTeamForm(onTeamCreated?: (team: Team) => void) {
  const [teamFormData, setTeamFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    status: "active",
    projectId: "",
  })
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false)
  const [teamSubmitStatus, setTeamSubmitStatus] = useState<SubmitStatus>({ type: null, message: "" })
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)

  const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTeamFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetTeamForm = () => {
    setTeamFormData({
      name: "",
      description: "",
      status: "active",
      projectId: "",
    })
    setTeamSubmitStatus({ type: null, message: "" })
  }

  const openTeamModal = (projectId?: string) => {
    if (projectId) setTeamFormData(prev => ({ ...prev, projectId }))
    setIsTeamModalOpen(true)
  }

  const closeTeamModal = () => {
    setIsTeamModalOpen(false)
    resetTeamForm()
  }

  const handleCreateTeam = async () => {
    setIsSubmittingTeam(true)
    setTeamSubmitStatus({ type: null, message: "" })

    try {
      const payload: CreateTeamPayload = {
        name: teamFormData.name,
        description: teamFormData.description,
        status: teamFormData.status,
        projectId: teamFormData.projectId || undefined,
      }

      const createdTeam = await createTeam(payload)
      setTeamSubmitStatus({ type: "success", message: `Equipo "${createdTeam.name}" creado y asociado al proyecto.` })

      // Notificar al contenedor (ProjectForm) que se creó el equipo
      if (onTeamCreated) onTeamCreated(createdTeam)
      // Cerrar modal y resetear después de un breve lapso
      setTimeout(() => {
        closeTeamModal()
      }, 1500)
    } catch (err: any) {
      setTeamSubmitStatus({ type: "error", message: err?.message || "No se pudo crear el equipo." })
    } finally {
      setIsSubmittingTeam(false)
    }
  }

  return {
    teamFormData,
    setTeamFormData,
    handleTeamChange,
    resetTeamForm,

    isSubmittingTeam,
    teamSubmitStatus,

    isTeamModalOpen,
    openTeamModal,
    closeTeamModal,

    handleCreateTeam,
  } as const
}
