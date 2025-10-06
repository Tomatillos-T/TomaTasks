import { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Textarea from "../../../components/TextArea";
import Select from "../../../components/Select";
import Button from "../../../components/Button";
import Alert from "../../../components/Alert";
import Modal from "../../../components/Modal";

interface UserStoryFormData {
  name: string;
  weight: number;
  description: string;
  status: "todo" | "in-progress" | "done";
  sprintId: string;
  createdAt: string;
  updatedAt: string;
}

interface SprintFormData {
  id?: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  startDate: string;
  endDate: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
}

interface ApiError {
  message: string;
  status?: number;
}

export default function UserStoryForm() {
  const API_BASE_URL = "http://localhost:8080";

  // User Story State
  const [formData, setFormData] = useState<UserStoryFormData>({
    name: "",
    weight: 1,
    description: "",
    status: "todo",
    sprintId: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });
  const [sprints, setSprints] = useState<SprintFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  // Sprint Modal State
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [sprintFormData, setSprintFormData] = useState<SprintFormData>({
    description: "",
    status: "planned",
    startDate: "",
    endDate: "",
    projectId: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSubmittingSprint, setIsSubmittingSprint] = useState(false);
  const [sprintSubmitStatus, setSprintSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects`);
        if (!res.ok) throw new Error(`Error fetching projects: ${res.status}`);
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "weight" ? Number(value) : value, updatedAt: new Date().toISOString().split("T")[0] }));
  };

  const handleSprintChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSprintFormData(prev => ({ ...prev, [name]: value, updatedAt: new Date().toISOString().split("T")[0] }));
  };

  const resetForm = () => setFormData({
    name: "",
    weight: 1,
    description: "",
    status: "todo",
    sprintId: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });

  const resetSprintForm = () => setSprintFormData({
    description: "",
    status: "planned",
    startDate: "",
    endDate: "",
    projectId: projects[0]?.id || "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });

  // Submit User Story
  const handleSubmitUserStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const payload = {
        name: formData.name.trim(),
        weight: formData.weight,
        description: formData.description.trim(),
        status: formData.status,
        sprintId: formData.sprintId || null,
      };

      const res = await fetch(`${API_BASE_URL}/api/user-story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw { message: errData.message || `Server error: ${res.status}`, status: res.status } as ApiError;
      }

      const created = await res.json();
      setSubmitStatus({ type: "success", message: `User Story "${created.name}" created!` });
      setTimeout(() => { resetForm(); setSubmitStatus({ type: null, message: "" }) }, 3000);

    } catch (err) {
      const apiErr = err as ApiError;
      setSubmitStatus({ type: "error", message: apiErr.message || "Failed to create user story." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Sprint
  const handleCreateSprint = async () => {
    setIsSubmittingSprint(true);
    setSprintSubmitStatus({ type: null, message: "" });

    try {
      const payload = {
        description: sprintFormData.description.trim(),
        status: sprintFormData.status,
        startDate: sprintFormData.startDate || null,
        endDate: sprintFormData.endDate || null,
        project: sprintFormData.projectId ? { id: sprintFormData.projectId } : null,
      };

      const res = await fetch(`${API_BASE_URL}/api/sprints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw { message: errData.message || `Server error: ${res.status}`, status: res.status } as ApiError;
      }

      const created = await res.json();
      setSprintSubmitStatus({ type: "success", message: `Sprint "${created.description}" created!` });
      setFormData(prev => ({ ...prev, sprintId: created.id }));
      setSprints(prev => [...prev, created]);
      setTimeout(() => { resetSprintForm(); setIsSprintModalOpen(false); setSprintSubmitStatus({ type: null, message: "" }) }, 1500);

    } catch (err) {
      const apiErr = err as ApiError;
      setSprintSubmitStatus({ type: "error", message: apiErr.message || "Failed to create sprint." });
    } finally {
      setIsSubmittingSprint(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background-default">
      <form onSubmit={handleSubmitUserStory} className="max-w-3xl w-full p-8 bg-background-paper rounded-2xl shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">User Story</h2>
            <p className="text-sm text-text-secondary">Fill in the details below.</p>
          </div>
        </div>

        {submitStatus.type && <Alert type={submitStatus.type} message={submitStatus.message} />}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input label="Name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
          <Select
            label="Weight"
            name="weight"
            value={formData.weight.toString()}
            onChange={handleChange}
            options={[
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4", value: "4" },
            ]}
            disabled={isSubmitting}
          />
          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={4} disabled={isSubmitting} />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Done", value: "done" },
            ]}
            disabled={isSubmitting}
          />

          {/* Sprint Dropdown */}
          {isLoadingProjects ? (
            <Select
              label="Sprint"
              name="sprintId"
              value=""
              onChange={handleChange}
              disabled
              options={[{ label: "Cargando sprints...", value: "" }]}
            />
          ) : sprints.length === 0 ? (
            <Button type="button" variant="primary" onClick={() => setIsSprintModalOpen(true)}>
              Crear nuevo sprint
            </Button>
          ) : (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Select
                  label="Sprint"
                  name="sprintId"
                  value={formData.sprintId}
                  onChange={handleChange}
                  options={sprints.map((s) => ({ label: s.description, value: s.id! }))}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="button" variant="secondary" onClick={() => setIsSprintModalOpen(true)} disabled={isSubmitting}>
                +
              </Button>
            </div>
          )}

        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input label="Created At" type="date" name="createdAt" value={formData.createdAt} disabled />
          <Input label="Updated At" type="date" name="updatedAt" value={formData.updatedAt} disabled />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={resetForm} disabled={isSubmitting}>Reset</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>Save User Story</Button>
        </div>
      </form>

      {/* Sprint Creation Modal */}
      <Modal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        title="Create Sprint"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsSprintModalOpen(false)} disabled={isSubmittingSprint}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateSprint} loading={isSubmittingSprint} disabled={isSubmittingSprint}>Save</Button>
          </>
        }
      >
        {sprintSubmitStatus.type && <Alert type={sprintSubmitStatus.type} message={sprintSubmitStatus.message} />}
        <Textarea label="Description" name="description" value={sprintFormData.description} onChange={handleSprintChange} rows={3} disabled={isSubmittingSprint} />
        <Select label="Status" name="status" value={sprintFormData.status} onChange={handleSprintChange} disabled={isSubmittingSprint} options={[
          { label: "Planned", value: "planned" },
          { label: "In Progress", value: "in-progress" },
          { label: "Completed", value: "completed" },
        ]} />
        <Select label="Project" name="projectId" value={sprintFormData.projectId} onChange={handleSprintChange} disabled={isSubmittingSprint} options={projects.map(p => ({ label: p.name, value: p.id }))} required />
        <Input label="Start Date" type="date" name="startDate" value={sprintFormData.startDate} onChange={handleSprintChange} required disabled={isSubmittingSprint} />
        <Input label="End Date" type="date" name="endDate" value={sprintFormData.endDate} onChange={handleSprintChange} disabled={isSubmittingSprint} />
        <Input label="Created At" type="date" name="createdAt" value={sprintFormData.createdAt} disabled />
        <Input label="Updated At" type="date" name="updatedAt" value={sprintFormData.updatedAt} disabled />
      </Modal>
    </section>
  );
}
