import { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Textarea from "../../../components/TextArea";
import Select from "../../../components/Select";
import Button from "../../../components/Button";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";

interface SprintFormData {
  description: string;
  status: "planned" | "in-progress" | "completed";
  startDate: string;
  endDate: string;
  deliveryDate: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
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

export default function SprintForm() {
  const [formData, setFormData] = useState<SprintFormData>({
    description: "",
    status: "planned",
    startDate: "",
    endDate: "",
    deliveryDate: "",
    projectId: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

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

  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects`);
        if (res.ok) {
          const data = await res.json();
          const options = data.map((p: any) => ({ label: p.name, value: p.id }));
          setProjects(options);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    }
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString().split("T")[0],
    }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProjectFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      description: "",
      status: "planned",
      startDate: "",
      endDate: "",
      deliveryDate: "",
      projectId: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    });
  };

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
        deliveryDate: formData.deliveryDate || null,
        project: { id: formData.projectId || null },
      };

      const res = await fetch(`${API_BASE_URL}/api/sprints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw { message: errorData.message || `Server error: ${res.status}`, status: res.status } as ApiError;
      }

      const createdSprint = await res.json();
      setSubmitStatus({ type: "success", message: `Sprint "${createdSprint.description}" created successfully!` });

      setTimeout(() => {
        resetForm();
        setSubmitStatus({ type: null, message: "" });
      }, 3000);
    } catch (error) {
      const apiError = error as ApiError;
      setSubmitStatus({ type: "error", message: apiError.message || "Failed to create sprint. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async () => {
    setIsSubmittingProject(true);
    setProjectSubmitStatus({ type: null, message: "" });
    try {
      const payload = {
        name: projectFormData.name.trim(),
        description: projectFormData.description.trim(),
        status: projectFormData.status,
        startDate: projectFormData.startDate,
        deliveryDate: projectFormData.deliveryDate || null,
      };

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
      setProjectSubmitStatus({ type: "success", message: `Project "${createdProject.name}" created!` });

      // Update project list and select the new project
      setProjects((prev) => [...prev, { label: createdProject.name, value: createdProject.id }]);
      setFormData((prev) => ({ ...prev, projectId: createdProject.id }));

      setTimeout(() => {
        setIsProjectModalOpen(false);
        setProjectFormData({ name: "", description: "", status: "planning", startDate: "", deliveryDate: "" });
        setProjectSubmitStatus({ type: null, message: "" });
      }, 1500);

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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Sprint Information</h2>
            <p className="text-sm text-text-secondary">Complete the sprint details below.</p>
          </div>
          <Button type="button" variant="primary" onClick={() => setIsProjectModalOpen(true)}>Create Project</Button>
        </div>

        {submitStatus.type && <Alert type={submitStatus.type} message={submitStatus.message} />}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Sprint description..." rows={4} disabled={isSubmitting} />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { label: "Planned", value: "planned" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
            ]}
            disabled={isSubmitting}
          />
          <Select
            label="Project"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            options={projects}
            disabled={isSubmitting}
          />
          <Input label="Start Date" type="date" name="startDate" value={formData.startDate} onChange={handleChange} disabled={isSubmitting} required />
          <Input label="End Date" type="date" name="endDate" value={formData.endDate} onChange={handleChange} disabled={isSubmitting} />
          <Input label="Delivery Date" type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} disabled={isSubmitting} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input label="Created At" type="date" name="createdAt" value={formData.createdAt} disabled />
          <Input label="Updated At" type="date" name="updatedAt" value={formData.updatedAt} disabled />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={resetForm} disabled={isSubmitting}>Reset</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>Save Sprint</Button>
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
