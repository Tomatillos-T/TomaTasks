// teams/hooks/useTeamForm.ts
import { useState } from "react"
import { createTeam } from "../services/teamService"
import type { CreateTeamPayload } from "../services/teamService"
import { TeamStatusEnum } from "../services/teamService"
import type { Team } from "../services/teamService"

export interface TeamFormData {
  name: string
  description: string
  status: TeamStatusEnum
  projectId: string
}

export type SubmitStatus = { type: "success" | "error" | null; message: string }

export function useTeamForm(onTeamCreated?: (team: Team) => void) {
  const [teamFormData, setTeamFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    status: TeamStatusEnum.ACTIVO,
    projectId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: "" })

  const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTeamFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setTeamFormData({ name: "", description: "", status: TeamStatusEnum.ACTIVO, projectId: "" })
    setSubmitStatus({ type: null, message: "" })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const payload: CreateTeamPayload = { ...teamFormData }
      const createdTeam = await createTeam(payload)
      setSubmitStatus({ type: "success", message: `Team "${createdTeam.name}" created successfully!` })
      if (onTeamCreated) onTeamCreated(createdTeam)
      setTimeout(() => { resetForm() }, 3000)
    } catch (err: any) {
      setSubmitStatus({ type: "error", message: err?.message || "Failed to create team." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    teamFormData,
    setTeamFormData,
    handleTeamChange,
    resetForm,
    isSubmitting,
    submitStatus,
    handleSubmit,
  } as const
}