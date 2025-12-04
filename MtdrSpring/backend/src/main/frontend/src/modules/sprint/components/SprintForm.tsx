import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Textarea from "@/components/TextArea";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import Modal from "@/components/Modal";

type SprintStatus = "planned" | "in-progress" | "completed";
type ProjectStatus =
  | "planning"
  | "in-progress"
  | "on-hold"
  | "completed"
  | "cancelled";

interface SprintFormData {
  description: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  //deliveryDate: string
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  deliveryDate: string;
}

interface ApiError {
  message: string;
  status?: number;
}

export default function SprintForm() {
  const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  const [formData, setFormData] = useState<SprintFormData>({
    description: "",
    status: "planned",
    startDate: "",
    endDate: "",
    //deliveryDate: "",
    projectId: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Modal para crear proyecto
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "planning",
    startDate: "",
    deliveryDate: "",
  });
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectSubmitStatus, setProjectSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Obtener proyectos
  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (!response.ok)
        throw new Error(`Error al obtener proyectos: ${response.status}`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Manejo de cambios en formulario de sprint
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString().split("T")[0],
    }));
  };

  // Manejo de cambios en formulario de proyecto
  const handleProjectChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProjectFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      description: "",
      status: "planned",
      startDate: "",
      endDate: "",
      //deliveryDate: "",
      projectId: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    });
  };

  const resetProjectForm = () => {
    setProjectFormData({
      name: "",
      description: "",
      status: "planning",
      startDate: "",
      deliveryDate: "",
    });
    setProjectSubmitStatus({ type: null, message: "" });
  };

  // Crear sprint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const payload = {
        description: formData.description.trim(),
        status: formData.status,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        //deliveryDate: formData.deliveryDate || null,
        project: formData.projectId ? { id: formData.projectId } : null,
      };

      console.log("Payload to submit:", payload);

      const response = await fetch(`${API_BASE_URL}/api/sprints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message:
            errorData.message || `Error del servidor: ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      const createdSprint = await response.json();
      setSubmitStatus({
        type: "success",
        message: `Sprint "${createdSprint.description}" creado correctamente.`,
      });
      setTimeout(() => {
        resetForm();
        setSubmitStatus({ type: null, message: "" });
      }, 3000);
    } catch (error) {
      const apiError = error as ApiError;
      setSubmitStatus({
        type: "error",
        message: apiError.message || "No se pudo crear el sprint.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Crear proyecto desde modal
  const handleCreateProject = async () => {
    setIsSubmittingProject(true);
    setProjectSubmitStatus({ type: null, message: "" });

    try {
      const payload = { ...projectFormData };

      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message:
            errorData.message || `Error del servidor: ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      const createdProject: Project = await response.json();
      setProjectSubmitStatus({
        type: "success",
        message: `Proyecto "${createdProject.name}" creado.`,
      });
      setFormData((prev) => ({ ...prev, projectId: createdProject.id }));
      fetchProjects();
      setTimeout(() => {
        setIsProjectModalOpen(false);
        resetProjectForm();
      }, 1500);
    } catch (error) {
      const apiError = error as ApiError;
      setProjectSubmitStatus({
        type: "error",
        message: apiError.message || "No se pudo crear el proyecto.",
      });
    } finally {
      setIsSubmittingProject(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background-default">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full p-8 bg-background-paper rounded-2xl shadow-lg space-y-6"
      >
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Información del Sprint
          </h2>
          <p className="text-sm text-text-secondary">
            Complete los datos del sprint a continuación.
          </p>
        </div>

        {submitStatus.type && (
          <Alert type={submitStatus.type} message={submitStatus.message} />
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del sprint..."
            rows={4}
            disabled={isSubmitting}
          />

          <Select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { label: "Planificado", value: "planned" },
              { label: "En Progreso", value: "in-progress" },
              { label: "Completado", value: "completed" },
            ]}
            disabled={isSubmitting}
          />

          <div className="flex items-end gap-2 sm:col-span-2">
            <div className="flex-1">
              {isLoadingProjects ? (
                <Select
                  label="Proyecto"
                  name="projectId"
                  value=""
                  onChange={handleChange}
                  disabled
                  options={[{ label: "Cargando proyectos...", value: "" }]}
                />
              ) : projects.length === 0 ? (
                <div>
                  <p className="text-text-secondary mb-2">
                    No hay proyectos disponibles.
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsProjectModalOpen(true)}
                  >
                    Crear nuevo proyecto
                  </Button>
                </div>
              ) : (
                <Select
                  label="Proyecto"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  options={projects.map((p) => ({
                    label: p.name,
                    value: p.id,
                  }))}
                  disabled={isSubmitting}
                />
              )}
            </div>

            {!isLoadingProjects && projects.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsProjectModalOpen(true)}
                disabled={isSubmitting}
              >
                +
              </Button>
            )}
          </div>

          <Input
            label="Fecha de Inicio"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <Input
            label="Fecha de Fin"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {/*
          <Input label="Fecha de Entrega" type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} disabled={isSubmitting} />
          */}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="Creado el"
            type="date"
            name="createdAt"
            value={formData.createdAt}
            disabled
          />
          <Input
            label="Actualizado el"
            type="date"
            name="updatedAt"
            value={formData.updatedAt}
            disabled
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Reiniciar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Guardar Sprint
          </Button>
        </div>
      </form>

      {/* Modal para crear proyecto */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Crear Nuevo Proyecto"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsProjectModalOpen(false)}
              disabled={isSubmittingProject}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateProject}
              loading={isSubmittingProject}
              disabled={isSubmittingProject}
            >
              Guardar
            </Button>
          </>
        }
      >
        {projectSubmitStatus.type && (
          <Alert
            type={projectSubmitStatus.type}
            message={projectSubmitStatus.message}
          />
        )}
        <Input
          label="Nombre del Proyecto"
          name="name"
          value={projectFormData.name}
          onChange={handleProjectChange}
          required
          disabled={isSubmittingProject}
          placeholder="Nombre del proyecto"
        />
        <Textarea
          label="Descripción"
          name="description"
          value={projectFormData.description}
          onChange={handleProjectChange}
          required
          disabled={isSubmittingProject}
          placeholder="Descripción del proyecto"
          rows={3}
        />
        <Select
          label="Estado"
          name="status"
          value={projectFormData.status}
          onChange={handleProjectChange}
          disabled={isSubmittingProject}
          options={[
            { label: "En planificación", value: "planning" },
            { label: "En progreso", value: "in-progress" },
            { label: "En pausa", value: "on-hold" },
            { label: "Completado", value: "completed" },
            { label: "Cancelado", value: "cancelled" },
          ]}
        />
        <Input
          label="Fecha de Inicio"
          type="date"
          name="startDate"
          value={projectFormData.startDate}
          onChange={handleProjectChange}
          required
          disabled={isSubmittingProject}
        />
        <Input
          label="Fecha de Entrega"
          type="date"
          name="deliveryDate"
          value={projectFormData.deliveryDate}
          onChange={handleProjectChange}
          disabled={isSubmittingProject}
        />
      </Modal>
    </section>
  );
}
