// teams/hooks/useProjectModalForm.ts
import { useState, useEffect } from "react"
import { createProject, getProjects } from "../services/projectService"
import type { HttpError } from "../../../services/httpClient"
import type { CreateProjectPayload } from "../services/projectService"

export interface ProjectOption {
  label: string
  value: string
}

export interface ProjectFormData {
  name: string
  description: string
  status: "planning" | "in-progress" | "on-hold" | "completed" | "cancelled"
  startDate: string
  deliveryDate: string
}

export type SubmitStatus = { type: "success" | "error" | null; message: string }

export function useProjectModalForm(onProjectCreated?: (id: string) => void) {
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "planning",
    startDate: "",
    deliveryDate: "",
  })
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isSubmittingProject, setIsSubmittingProject] = useState(false)
  const [projectSubmitStatus, setProjectSubmitStatus] = useState<SubmitStatus>({ type: null, message: "" })

  const fetchProjectsList = async () => {
    try {
      const data = await getProjects()
      setProjects(data.map(p => ({ label: p.name, value: p.id })))
    } catch (err) {
      console.error("Error fetching projects:", err)
      setProjects([])
    }
  }

  useEffect(() => {
    fetchProjectsList()
  }, [])

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProjectFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetProjectForm = () => {
    setProjectFormData({ name: "", description: "", status: "planning", startDate: "", deliveryDate: "" })
    setProjectSubmitStatus({ type: null, message: "" })
  }

  const handleCreateProject = async () => {
    setIsSubmittingProject(true)
    setProjectSubmitStatus({ type: null, message: "" })
    try {
      const payload: CreateProjectPayload = { ...projectFormData }
      const createdProject = await createProject(payload)
      setProjectSubmitStatus({ type: "success", message: `Project "${createdProject.name}" created.` })
      fetchProjectsList()
      if (onProjectCreated) onProjectCreated(createdProject.id)
      setTimeout(() => {
        setIsProjectModalOpen(false)
        resetProjectForm()
      }, 1500)
    } catch (err: any) {
  const apiError = err as HttpError
  setProjectSubmitStatus({ type: "error", message: apiError.message || "Failed to create project." })
} finally {
      setIsSubmittingProject(false)
    }
  }

  return {
    projects,
    projectFormData,
    setProjectFormData,
    isProjectModalOpen,
    setIsProjectModalOpen,
    isSubmittingProject,
    projectSubmitStatus,
    fetchProjectsList,
    handleProjectChange,
    handleCreateProject,
    resetProjectForm,
  } as const
}
