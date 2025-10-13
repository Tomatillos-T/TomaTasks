// projects/hooks/useProjectForm.ts
import { useEffect, useState, useCallback } from "react"
import { createProject } from "../services/projectService"
import type { CreateProjectPayload } from "../services/projectService"
import { getTeams } from "../services/teamService"
import type { Team } from "../services/teamService"


export type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled"

export interface ProjectFormData {
  name: string
  description: string
  status: ProjectStatus
  startDate: string
  deliveryDate: string
  endDate: string
  teamId: string
}

export type SubmitStatus = { type: "success" | "error" | null; message: string }

export function useProjectForm() {
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
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: "" })

  const [tempProjectId, setTempProjectId] = useState<string | null>(null)
  const [isCreatingProjectForTeam, setIsCreatingProjectForTeam] = useState(false)

  const fetchTeams = useCallback(async () => {
    setIsLoadingTeams(true)
    try {
      const data = await getTeams()
      setTeams(data)
    } catch (error) {
      console.error(error)
      setTeams([])
    } finally {
      setIsLoadingTeams(false)
    }
  }, [])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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
    setTempProjectId(null)
    setSubmitStatus({ type: null, message: "" })
  }

  const isProjectFormValid = () => {
    return formData.name.trim() !== "" && formData.description.trim() !== "" && formData.startDate !== ""
  }

  // Crear proyecto temporalmente antes de abrir modal de equipo.
  // Devuelve el id creado (o el tempProjectId existente).
  const createTemporaryProjectIfNeeded = async (): Promise<string | null> => {
    if (tempProjectId) return tempProjectId

    if (!isProjectFormValid()) {
      setSubmitStatus({
        type: "error",
        message: "Por favor completa los campos requeridos del proyecto antes de crear un equipo.",
      })
      return null
    }

    setIsCreatingProjectForTeam(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const payload: CreateProjectPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        startDate: formData.startDate,
        deliveryDate: formData.deliveryDate || null,
        endDate: formData.endDate || null,
        team: null,
      }

      const created = await createProject(payload)
      setTempProjectId(created.id)
      setSubmitStatus({ type: "success", message: `Proyecto guardado. Ahora puedes crear el equipo.` })
      return created.id
    } catch (err: any) {
      setSubmitStatus({ type: "error", message: err?.message || "No se pudo crear el proyecto." })
      return null
    } finally {
      setIsCreatingProjectForTeam(false)
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Si ya existe un proyecto temporal, solo finalizar y resetear.
    if (tempProjectId) {
      setSubmitStatus({ type: "success", message: "Proyecto creado correctamente." })
      setTimeout(() => {
        resetForm()
      }, 2000)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const payload: CreateProjectPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        startDate: formData.startDate,
        deliveryDate: formData.deliveryDate || null,
        endDate: formData.endDate || null,
        team: formData.teamId ? { id: formData.teamId } : null,
      }

      const created = await createProject(payload)
      setSubmitStatus({ type: "success", message: `Proyecto "${created.name}" creado correctamente.` })
      setTimeout(() => resetForm(), 2000)
    } catch (err: any) {
      setSubmitStatus({ type: "error", message: err?.message || "No se pudo crear el proyecto." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
    isSubmitting,
    submitStatus,
    setSubmitStatus,

    teams,
    fetchTeams,
    isLoadingTeams,

    tempProjectId,
    isCreatingProjectForTeam,
    createTemporaryProjectIfNeeded,

    handleSubmit,
  } as const
}
