import { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Textarea from "../../../components/TextArea";
import Select from "../../../components/Select";
import Button from "../../../components/Button";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";

interface TeamFormData {
  name: string;
  description: string;
  status: "active" | "inactive";
  projectId: string;
}

interface ProjectOption {
  label: string;
  value: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: "planning" | "in-progress" | "on-hold" | "completed" | "cancelled";
  startDate: string;
  deliveryDate: string;
}

interface ApiError {
  message: string;
  status?: number;
}

export default function TeamForm() {
  const API_BASE_URL = "http://localhost:8080";

  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    status: "active",
    projectId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  
  // Modal de creación de proyecto
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "planning",
    startDate: "",
    deliveryDate: "",
  });
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectSubmitStatus, setProjectSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  // Cargar proyectos
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.map((p: any) => ({ label: p.name, value: p.id })));
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProjectFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData({ name: "", description: "", status: "active", projectId: "" });
  const resetProjectForm = () => setProjectFormData({ name: "", description: "", status: "planning", startDate: "", deliveryDate: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        project: formData.projectId ? { id: formData.projectId } : null,
      };

      const res = await fetch(`${API_BASE_URL}/api/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw { message: errorData.message || `Server error: ${res.status}`, status: res.status } as ApiError;
      }

      const createdTeam = await res.json();
      setSubmitStatus({ type: "success", message: `Team "${createdTeam.name}" created successfully!` });
      setTimeout(() => { resetForm(); setSubmitStatus({ type: null, message: "" }); }, 3000);
    } catch (error) {
      const apiError = error as ApiError;
      setSubmitStatus({ type: "error", message: apiError.message || "Failed to create team." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async () => {
    setIsSubmittingProject(true);
    setProjectSubmitStatus({ type: null, message: "" });

    try {
      const payload = { ...projectFormData };
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw { message: errorData.message || `Server error: ${res.status}`, status: res.status } as ApiError;
      }

      const createdProject = await res.json();
      setProjectSubmitStatus({ type: "success", message: `Project "${createdProject.name}" created.` });
      fetchProjects();
      setFormData(prev => ({ ...prev, projectId: createdProject.id }));
      setTimeout(() => { setIsProjectModalOpen(false); resetProjectForm(); setProjectSubmitStatus({ type: null, message: "" }); }, 1500);
    } catch (error) {
      const apiError = error as ApiError;
      setProjectSubmitStatus({ type: "error", message: apiError.message || "Failed to create project." });
    } finally {
      setIsSubmittingProject(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background-default">
      <form onSubmit={handleSubmit} className="max-w-3xl w-full p-8 bg-background-paper rounded-2xl shadow-lg space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Información del equipo</h2>
          <p className="text-sm text-text-secondary">Completa los detalles del equipo.</p>
        </div>

        {submitStatus.type && <Alert type={submitStatus.type} message={submitStatus.message} />}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input label="Nombre del equipo" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} placeholder="Escribe el nombre del equipo" />
          <Select label="Status" name="status" value={formData.status} onChange={handleChange} disabled={isSubmitting} options={[
            { label: "Activo", value: "active" },
            { label: "Inactivo", value: "inactive" },
          ]} />

          <div className="flex flex-col gap-2">
            <Select label="Proyecto" name="projectId" value={formData.projectId} onChange={handleChange} disabled={isSubmitting} options={projects} />
            <Button type="button" variant="primary" onClick={() => setIsProjectModalOpen(true)}>Crear Nuevo Proyecto</Button>
          </div>

          <Textarea label="Descripción" name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} placeholder="Descripción del equipo..." rows={4} />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={resetForm} disabled={isSubmitting}>Reiniciar</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>Guardar equipo</Button>
        </div>
      </form>

      {/* Modal para crear proyecto */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsProjectModalOpen(false)} disabled={isSubmittingProject}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateProject} loading={isSubmittingProject} disabled={isSubmittingProject}>Save</Button>
          </>
        }
      >
        {projectSubmitStatus.type && <Alert type={projectSubmitStatus.type} message={projectSubmitStatus.message} />}
        <Input label="Project Name" name="name" value={projectFormData.name} onChange={handleProjectChange} required disabled={isSubmittingProject} />
        <Textarea label="Description" name="description" value={projectFormData.description} onChange={handleProjectChange} disabled={isSubmittingProject} rows={3} />
        <Select label="Status" name="status" value={projectFormData.status} onChange={handleProjectChange} disabled={isSubmittingProject} options={[
          { label: "Planning", value: "planning" },
          { label: "In Progress", value: "in-progress" },
          { label: "On Hold", value: "on-hold" },
          { label: "Completed", value: "completed" },
          { label: "Cancelled", value: "cancelled" },
        ]} />
        <Input label="Start Date" type="date" name="startDate" value={projectFormData.startDate} onChange={handleProjectChange} required disabled={isSubmittingProject} />
        <Input label="Delivery Date" type="date" name="deliveryDate" value={projectFormData.deliveryDate} onChange={handleProjectChange} disabled={isSubmittingProject} />
      </Modal>
    </section>
  );
}
