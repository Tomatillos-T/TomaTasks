import { useState, useEffect } from "react";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Textarea from "../../../components/TextArea";
import Button from "../../../components/Button";
import Alert from "../../../components/Alert";
import createTaskAdapter from "../adapters/createTaskAdapter";
import { useQueryClient } from "@tanstack/react-query";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
}

interface Sprint {
  id: string;
  description: string;
}

interface UserStory {
  id: string;
  name: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeEstimate, setTimeEstimate] = useState<number>(0);
  const [assigneeId, setAssigneeId] = useState("");
  const [sprintId, setSprintId] = useState("");
  const [userStoryId, setUserStoryId] = useState("");

  // Data for dropdowns
  const [users, setUsers] = useState<User[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch users, sprints, and user stories on mount
  useEffect(() => {
    if (isOpen) {
      fetchFormData();
    }
  }, [isOpen]);

  const fetchFormData = async () => {
    setIsLoadingData(true);
    try {
      const [usersRes, sprintsRes, userStoriesRes] = await Promise.all([
        fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
          },
        }),
        fetch("/api/sprints", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
          },
        }),
        fetch("/api/user-stories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
          },
        }),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      if (sprintsRes.ok) {
        const sprintsData = await sprintsRes.json();
        setSprints(sprintsData);
      }
      if (userStoriesRes.ok) {
        const userStoriesData = await userStoriesRes.json();
        setUserStories(userStoriesData);
      }
    } catch (err) {
      console.error("Error loading form data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("El nombre de la tarea es requerido");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const result = await createTaskAdapter({
      name,
      description,
      timeEstimate,
      assigneeId: assigneeId || undefined,
      sprintId: sprintId || undefined,
      userStoryId: userStoryId || undefined,
    });

    setIsSubmitting(false);

    if (result.status === 200) {
      setSuccess(result.message);
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Reset form
      resetForm();
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setTimeEstimate(0);
    setAssigneeId("");
    setSprintId("");
    setUserStoryId("");
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nueva Tarea"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || !name.trim()}
          >
            Crear Tarea
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {isLoadingData ? (
          <div className="text-center py-4 text-text-secondary">
            Cargando datos del formulario...
          </div>
        ) : (
          <>
            <Input
              label="Nombre de la tarea"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: Implementar autenticación"
            />

            <Textarea
              label="Descripción"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe la tarea..."
            />

            <Input
              label="Estimación de tiempo (horas)"
              type="number"
              name="timeEstimate"
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(Number(e.target.value))}
              min={0}
              placeholder="0"
            />

            <div className="flex flex-col">
              <label className="text-sm font-medium text-text-primary mb-1">
                Asignar a usuario
              </label>
              <select
                className="px-3 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="">Seleccione un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-text-primary mb-1">
                Sprint
              </label>
              <select
                className="px-3 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main"
                value={sprintId}
                onChange={(e) => setSprintId(e.target.value)}
              >
                <option value="">Seleccione un sprint</option>
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-text-primary mb-1">
                Historia de Usuario
              </label>
              <select
                className="px-3 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main"
                value={userStoryId}
                onChange={(e) => setUserStoryId(e.target.value)}
              >
                <option value="">Seleccione una historia de usuario</option>
                {userStories.map((story) => (
                  <option key={story.id} value={story.id}>
                    {story.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
