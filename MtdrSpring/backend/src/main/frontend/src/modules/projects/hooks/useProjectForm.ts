import { useEffect, useState, useCallback } from "react";
import { createProject } from "../services/projectService";
import type { Project, CreateProjectPayload } from "../services/projectService";
import { getTeams } from "../services/teamService";
import type { Team } from "../services/teamService";
import { HttpClient } from "../../../services/httpClient";

// Fonction pour update
async function updateProject(id: string, payload: CreateProjectPayload): Promise<Project> {
  return HttpClient.put<Project>(`/api/projects/${id}`, payload, { auth: true });
}

export type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled";

export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  deliveryDate: string;
  endDate: string;
  teamId: string;
}

export type SubmitStatus = { type: "success" | "error" | null; message: string };

interface UseProjectFormProps {
  initialData?: Project;
}

export function useProjectForm({ initialData }: UseProjectFormProps = {}) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status || "planning",
    startDate: initialData?.startDate || "",
    deliveryDate: initialData?.deliveryDate || "",
    endDate: initialData?.endDate || "",
    teamId: initialData?.team?.id || "",
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: "" });

  const [tempProjectId, setTempProjectId] = useState<string | null>(null);
  const [isCreatingProjectForTeam, setIsCreatingProjectForTeam] = useState(false);

  const fetchTeams = useCallback(async () => {
    setIsLoadingTeams(true);
    try {
      const data = await getTeams();
      setTeams(data);
    } catch {
      setTeams([]);
    } finally {
      setIsLoadingTeams(false);
    }
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        status: initialData.status || "planning",
        startDate: initialData.startDate || "",
        deliveryDate: initialData.deliveryDate || "",
        endDate: initialData.endDate || "",
        teamId: initialData.team?.id || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "planning",
      startDate: "",
      deliveryDate: "",
      endDate: "",
      teamId: "",
    });
    setTempProjectId(null);
    setSubmitStatus({ type: null, message: "" });
  };

  const isProjectFormValid = () => {
    return formData.name.trim() !== "" && formData.description.trim() !== "" && formData.startDate !== "";
  };

  const createTemporaryProjectIfNeeded = async (): Promise<string | null> => {
    if (tempProjectId) return tempProjectId;

    if (!isProjectFormValid()) {
      setSubmitStatus({ type: "error", message: "Por favor completa los campos requeridos." });
      return null;
    }

    setIsCreatingProjectForTeam(true);
    try {
      const payload: CreateProjectPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        startDate: formData.startDate,
        deliveryDate: formData.deliveryDate || null,
        endDate: formData.endDate || null,
        team: null,
      };

      const created = await createProject(payload);
      setTempProjectId(created.id);
      setSubmitStatus({ type: "success", message: "Proyecto guardado. Ahora puedes crear el equipo." });
      return created.id;
    } catch (err: any) {
      setSubmitStatus({ type: "error", message: err?.message || "No se pudo crear el proyecto." });
      return null;
    } finally {
      setIsCreatingProjectForTeam(false);
    }
  };

  const handleSubmit = async () => {
    if (!isProjectFormValid()) return null;

    const payload: CreateProjectPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      startDate: formData.startDate,
      deliveryDate: formData.deliveryDate || null,
      endDate: formData.endDate || null,
      team: formData.teamId ? { id: formData.teamId } : null,
    };

    setIsSubmitting(true);
    try {
      let result: Project;
      if (initialData?.id) {
        result = await updateProject(initialData.id, payload);
      } else {
        result = await createProject(payload);
      }
      setSubmitStatus({ type: "success", message: "Proyecto guardado correctamente." });
      return result;
    } catch (err: any) {
      setSubmitStatus({ type: "error", message: err?.message || "Error al guardar el proyecto." });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

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
  } as const;
}
