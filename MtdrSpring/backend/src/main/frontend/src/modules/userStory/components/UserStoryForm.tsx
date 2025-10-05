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

interface SprintOption {
  label: string;
  value: string;
}

interface SprintFormData {
  description: string;
  status: "planned" | "in-progress" | "completed";
  startDate: string;
  endDate: string;
  deliveryDate: string;
}

interface ApiError {
  message: string;
  status?: number;
}

export default function UserStoryForm() {
  const [formData, setFormData] = useState<UserStoryFormData>({
    name: "",
    weight: 1,
    description: "",
    status: "todo",
    sprintId: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });

  const [sprints, setSprints] = useState<SprintOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [sprintFormData, setSprintFormData] = useState<SprintFormData>({
    description: "",
    status: "planned",
    startDate: "",
    endDate: "",
    deliveryDate: "",
  });
  const [isSubmittingSprint, setIsSubmittingSprint] = useState(false);
  const [sprintSubmitStatus, setSprintSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    async function fetchSprints() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/sprints`);
        if (res.ok) {
          const data = await res.json();
          const options = data.map((s: any) => ({ label: s.description, value: s.id }));
          setSprints(options);
        }
      } catch (err) {
        console.error("Error fetching sprints:", err);
      }
    }
    fetchSprints();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "weight" ? Number(value) : value,
      updatedAt: new Date().toISOString().split("T")[0],
    }));
  };

  const handleSprintChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSprintFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      weight: 1,
      description: "",
      status: "todo",
      sprintId: "",
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
        name: formData.name.trim(),
        weight: formData.weight,
        description: formData.description.trim(),
        status: formData.status,
        sprintId: formData.sprintId ? Number(formData.sprintId) : null,
      };

      const res = await fetch(`${API_BASE_URL}/api/user-story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw { message: errorData.message || `Server error: ${res.status}`, status: res.status } as ApiError;
      }

      const createdStory = await res.json();
      setSubmitStatus({ type: "success", message: `User Story "${createdStory.name}" created successfully!` });

      setTimeout(() => {
        resetForm();
        setSubmitStatus({ type: null, message: "" });
      }, 3000);
    } catch (error) {
      const apiError = error as ApiError;
      setSubmitStatus({ type: "error", message: apiError.message || "Failed to create user story. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSprint = async () => {
    setIsSubmittingSprint(true);
    setSprintSubmitStatus({ type: null, message: "" });
    try {
      const payload = {
        description: sprintFormData.description.trim(),
        status: sprintFormData.status,
        startDate: sprintFormData.startDate,
        endDate: sprintFormData.endDate || null,
        deliveryDate: sprintFormData.deliveryDate || null,
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
      setSprintSubmitStatus({ type: "success", message: `Sprint "${createdSprint.description}" created!` });

      setSprints((prev) => [...prev, { label: createdSprint.description, value: createdSprint.id }]);
      setFormData((prev) => ({ ...prev, sprintId: createdSprint.id }));

      setTimeout(() => {
        setIsSprintModalOpen(false);
        setSprintFormData({ description: "", status: "planned", startDate: "", endDate: "", deliveryDate: "" });
        setSprintSubmitStatus({ type: null, message: "" });
      }, 1500);
    } catch (error) {
      const apiError = error as ApiError;
      setSprintSubmitStatus({ type: "error", message: apiError.message || "Failed to create sprint." });
    } finally {
      setIsSubmittingSprint(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background-default">
      <form onSubmit={handleSubmit} className="max-w-3xl w-full p-8 bg-background-paper rounded-2xl shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">User Story Information</h2>
            <p className="text-sm text-text-secondary">Fill in the user story details below.</p>
          </div>
          <Button type="button" variant="primary" onClick={() => setIsSprintModalOpen(true)}>Create Sprint</Button>
        </div>

        {submitStatus.type && <Alert type={submitStatus.type} message={submitStatus.message} />}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="User story name..." disabled={isSubmitting} required />
          <Input label="Weight" type="number" name="weight" value={formData.weight} onChange={handleChange} min={1} disabled={isSubmitting} />
          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe the user story..." rows={4} disabled={isSubmitting} />
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
          <Select
            label="Sprint"
            name="sprintId"
            value={formData.sprintId}
            onChange={handleChange}
            options={sprints}
            disabled={isSubmitting}
          />
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

      {/* Modal to create sprint */}
      <Modal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        title="Create New Sprint"
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
        <Input label="Start Date" type="date" name="startDate" value={sprintFormData.startDate} onChange={handleSprintChange} required disabled={isSubmittingSprint} />
        <Input label="End Date" type="date" name="endDate" value={sprintFormData.endDate} onChange={handleSprintChange} disabled={isSubmittingSprint} />
        <Input label="Delivery Date" type="date" name="deliveryDate" value={sprintFormData.deliveryDate} onChange={handleSprintChange} disabled={isSubmittingSprint} />
      </Modal>
    </section>
  );
}
