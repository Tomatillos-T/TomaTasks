import { useState } from "react";
import type React from "react";
import Input from "@/components/Input";
import Textarea from "@/components/TextArea";
import Select from "@/components/Select";
import SelectWithCreate from "@/components/SelectWithCreate-DEBUG";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import Modal from "@/components/Modal";
import useUsers from "@/modules/users/hooks/useUsers";
import useSprints from "@/modules/sprint/hooks/useSprints";
import useInfiniteUserStories from "@/modules/userStory/hooks/useInfiniteUserStories";
import useTaskForm from "@/modules/task/hooks/useTaskForm";

// Types
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "PENDING" | "TESTING";
type SubmitStatus = { type: "success" | "error" | null; message: string };

interface TaskFormData {
  name: string;
  description: string;
  timeEstimate: number;
  status: TaskStatus;
  userId: string;
  sprintId?: string;
  userStoryId?: string;
}

interface UserFormData {
  name: string;
  email: string;
}

interface SprintFormData {
  description: string;
  startDate: string;
  endDate: string;
}

interface UserStoryFormData {
  name: string;
  description: string;
  weight: number;
}

// Constants
const INITIAL_TASK_FORM: TaskFormData = {
  name: "",
  description: "",
  timeEstimate: 0,
  status: "TODO",
  userId: "",
  sprintId: "",
  userStoryId: "",
};

const INITIAL_USER_FORM: UserFormData = {
  name: "",
  email: "",
};

const INITIAL_SPRINT_FORM: SprintFormData = {
  description: "",
  startDate: "",
  endDate: "",
};

const INITIAL_USERSTORY_FORM: UserStoryFormData = {
  name: "",
  description: "",
  weight: 1,
};

const INITIAL_STATUS: SubmitStatus = { type: null, message: "" };

const TASK_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "Por Hacer", value: "TODO" },
  { label: "En Progreso", value: "IN_PROGRESS" },
  { label: "Pendiente", value: "PENDING" },
  { label: "En Pruebas", value: "TESTING" },
  { label: "Completado", value: "DONE" },
];

export default function TaskForm() {
  // Hooks
  const { users, isLoading: isLoadingUsers, createUser, isCreating: isCreatingUser } = useUsers();
  const { sprints, isLoading: isLoadingSprints } = useSprints();
  const { userStories, isLoading: isLoadingUserStories } = useInfiniteUserStories();
  const { createTask, isCreating: isCreatingTask } = useTaskForm();

  // Task form state
  const [formData, setFormData] = useState<TaskFormData>(INITIAL_TASK_FORM);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(INITIAL_STATUS);

  // User modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState<UserFormData>(INITIAL_USER_FORM);
  const [userSubmitStatus, setUserSubmitStatus] = useState<SubmitStatus>(INITIAL_STATUS);

  // Sprint modal state
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [sprintFormData, setSprintFormData] = useState<SprintFormData>(INITIAL_SPRINT_FORM);
  const [sprintSubmitStatus, setSprintSubmitStatus] = useState<SubmitStatus>(INITIAL_STATUS);
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);

  // UserStory modal state
  const [isUserStoryModalOpen, setIsUserStoryModalOpen] = useState(false);
  const [userStoryFormData, setUserStoryFormData] = useState<UserStoryFormData>(INITIAL_USERSTORY_FORM);
  const [userStorySubmitStatus, setUserStorySubmitStatus] = useState<SubmitStatus>(INITIAL_STATUS);
  const [isCreatingUserStory, setIsCreatingUserStory] = useState(false);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "timeEstimate" ? Number(value) : value,
    }));
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSprintChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSprintFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserStoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserStoryFormData((prev) => ({
      ...prev,
      [name]: name === "weight" ? Number(value) : value,
    }));
  };

  const resetForm = () => setFormData(INITIAL_TASK_FORM);

  const resetUserForm = () => {
    setUserFormData(INITIAL_USER_FORM);
    setUserSubmitStatus(INITIAL_STATUS);
  };

  const resetSprintForm = () => {
    setSprintFormData(INITIAL_SPRINT_FORM);
    setSprintSubmitStatus(INITIAL_STATUS);
  };

  const resetUserStoryForm = () => {
    setUserStoryFormData(INITIAL_USERSTORY_FORM);
    setUserStorySubmitStatus(INITIAL_STATUS);
  };

  // Submit task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      setSubmitStatus({
        type: "error",
        message: "Debe seleccionar un usuario para la tarea.",
      });
      return;
    }

    setSubmitStatus(INITIAL_STATUS);

    try {
      const result = await createTask(formData);

      setSubmitStatus({
        type: "success",
        message: `Tarea "${result.name}" creada correctamente.`,
      });

      setTimeout(() => {
        resetForm();
        setSubmitStatus(INITIAL_STATUS);
      }, 3000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: (error as Error).message || "No se pudo crear la tarea.",
      });
    }
  };

  // Create user
  const handleCreateUser = async () => {
    setUserSubmitStatus(INITIAL_STATUS);

    try {
      const createdUser = await createUser(userFormData);

      if (!createdUser) {
        throw new Error("No se pudo crear el usuario.");
      }

      setUserSubmitStatus({
        type: "success",
        message: `Usuario "${createdUser.name}" creado.`,
      });

      setFormData((prev) => ({ ...prev, userId: createdUser.id }));

      setTimeout(() => {
        setIsUserModalOpen(false);
        resetUserForm();
      }, 1500);
    } catch (error) {
      setUserSubmitStatus({
        type: "error",
        message: (error as Error).message || "No se pudo crear el usuario.",
      });
    }
  };

  // Create sprint
  const handleCreateSprint = async () => {
    setSprintSubmitStatus(INITIAL_STATUS);
    setIsCreatingSprint(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/sprints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
        },
        body: JSON.stringify({
          description: sprintFormData.description,
          status: "planned",
          startDate: sprintFormData.startDate,
          endDate: sprintFormData.endDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al crear sprint: ${response.status}`);
      }

      const createdSprint = await response.json();

      setSprintSubmitStatus({
        type: "success",
        message: "Sprint creado exitosamente.",
      });

      setFormData((prev) => ({ ...prev, sprintId: createdSprint.id }));

      setTimeout(() => {
        setIsSprintModalOpen(false);
        resetSprintForm();
      }, 1500);
    } catch (error) {
      setSprintSubmitStatus({
        type: "error",
        message: (error as Error).message || "No se pudo crear el sprint.",
      });
    } finally {
      setIsCreatingSprint(false);
    }
  };

  // Create user story
  const handleCreateUserStory = async () => {
    setUserStorySubmitStatus(INITIAL_STATUS);
    setIsCreatingUserStory(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/userStories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
        },
        body: JSON.stringify({
          name: userStoryFormData.name,
          description: userStoryFormData.description,
          weight: userStoryFormData.weight,
          status: "todo",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al crear historia de usuario: ${response.status}`);
      }

      const createdUserStory = await response.json();

      setUserStorySubmitStatus({
        type: "success",
        message: `Historia de usuario "${createdUserStory.name}" creada.`,
      });

      setFormData((prev) => ({ ...prev, userStoryId: createdUserStory.id }));

      setTimeout(() => {
        setIsUserStoryModalOpen(false);
        resetUserStoryForm();
      }, 1500);
    } catch (error) {
      setUserStorySubmitStatus({
        type: "error",
        message: (error as Error).message || "No se pudo crear la historia de usuario.",
      });
    } finally {
      setIsCreatingUserStory(false);
    }
  };

  // Render user select
  const renderUserSelect = () => {
    return (
      <SelectWithCreate
        label="Usuario Asignado"
        name="userId"
        value={formData.userId || ""}
        onChange={handleChange}
        onCreateClick={() => setIsUserModalOpen(true)}
        options={users?.map((user) => ({ label: user.name || "Sin nombre", value: user.id })) || []}
        required
        disabled={isCreatingTask}
        isLoading={isLoadingUsers}
        placeholder="-- Seleccione un usuario --"
      />
    );
  };

  // Render sprint select
  const renderSprintSelect = () => {
    return (
      <SelectWithCreate
        label="Sprint (Opcional)"
        name="sprintId"
        value={formData.sprintId || ""}
        onChange={handleChange}
        onCreateClick={() => setIsSprintModalOpen(true)}
        options={sprints?.map((sprint) => ({ label: sprint.name || "Sin nombre", value: sprint.id })) || []}
        disabled={isCreatingTask}
        isLoading={isLoadingSprints}
        placeholder="-- Sin sprint --"
      />
    );
  };

  // Render user story select
  const renderUserStorySelect = () => {
    return (
      <SelectWithCreate
        label="Historia de Usuario (Opcional)"
        name="userStoryId"
        value={formData.userStoryId || ""}
        onChange={handleChange}
        onCreateClick={() => setIsUserStoryModalOpen(true)}
        options={userStories?.map((story) => ({ label: story.name || "Sin nombre", value: story.id })) || []}
        disabled={isCreatingTask}
        isLoading={isLoadingUserStories}
        placeholder="-- Sin historia de usuario --"
      />
    );
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background-default">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full space-y-8 p-8 bg-background-paper rounded-2xl shadow-lg"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Información de la Tarea</h2>
          <p className="text-sm text-text-secondary">Complete los datos de la tarea a continuación.</p>
        </div>

        {/* Alert */}
        {submitStatus.type && <Alert type={submitStatus.type} message={submitStatus.message} />}

        {/* Form fields */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <Input
              label="Nombre de la Tarea"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isCreatingTask}
              placeholder="Ingrese el nombre de la tarea"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <Textarea
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isCreatingTask}
              placeholder="Describa la tarea..."
              rows={4}
            />
          </div>

          {/* Time estimate */}
          <Input
            label="Estimación de Tiempo (horas)"
            type="number"
            name="timeEstimate"
            value={formData.timeEstimate.toString()}
            onChange={handleChange}
            required
            disabled={isCreatingTask}
            placeholder="0"
            min="0"
          />

          {/* Status */}
          <Select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            disabled={isCreatingTask}
            options={TASK_STATUS_OPTIONS}
          />

          {/* User select */}
          <div className="sm:col-span-2">{renderUserSelect()}</div>

          {/* Sprint select */}
          <div className="sm:col-span-2">{renderSprintSelect()}</div>

          {/* UserStory select */}
          <div className="sm:col-span-2">{renderUserStorySelect()}</div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-x-4">
          <Button type="button" variant="secondary" onClick={resetForm} disabled={isCreatingTask}>
            Resetear
          </Button>
          <Button type="submit" variant="primary" loading={isCreatingTask} disabled={isCreatingTask}>
            Guardar Tarea
          </Button>
        </div>
      </form>

      {/* User creation modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Crear Nuevo Usuario"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsUserModalOpen(false)} disabled={isCreatingUser}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateUser} loading={isCreatingUser} disabled={isCreatingUser}>
              Guardar
            </Button>
          </>
        }
      >
        {userSubmitStatus.type && <Alert type={userSubmitStatus.type} message={userSubmitStatus.message} />}

        <Input
          label="Nombre del Usuario"
          name="name"
          value={userFormData.name}
          onChange={handleUserChange}
          required
          disabled={isCreatingUser}
          placeholder="Nombre completo"
        />

        <Input
          label="Correo Electrónico"
          type="email"
          name="email"
          value={userFormData.email}
          onChange={handleUserChange}
          required
          disabled={isCreatingUser}
          placeholder="usuario@ejemplo.com"
        />
      </Modal>

      {/* Sprint creation modal */}
      <Modal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        title="Crear Nuevo Sprint"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsSprintModalOpen(false)} disabled={isCreatingSprint}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateSprint} loading={isCreatingSprint} disabled={isCreatingSprint}>
              Guardar
            </Button>
          </>
        }
      >
        {sprintSubmitStatus.type && <Alert type={sprintSubmitStatus.type} message={sprintSubmitStatus.message} />}

        <Textarea
          label="Descripción"
          name="description"
          value={sprintFormData.description}
          onChange={handleSprintChange}
          required
          disabled={isCreatingSprint}
          placeholder="Describe el sprint..."
          rows={3}
        />

        <Input
          label="Fecha de Inicio"
          type="date"
          name="startDate"
          value={sprintFormData.startDate}
          onChange={handleSprintChange}
          required
          disabled={isCreatingSprint}
        />

        <Input
          label="Fecha de Fin"
          type="date"
          name="endDate"
          value={sprintFormData.endDate}
          onChange={handleSprintChange}
          required
          disabled={isCreatingSprint}
        />
      </Modal>

      {/* UserStory creation modal */}
      <Modal
        isOpen={isUserStoryModalOpen}
        onClose={() => setIsUserStoryModalOpen(false)}
        title="Crear Nueva Historia de Usuario"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsUserStoryModalOpen(false)} disabled={isCreatingUserStory}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateUserStory} loading={isCreatingUserStory} disabled={isCreatingUserStory}>
              Guardar
            </Button>
          </>
        }
      >
        {userStorySubmitStatus.type && <Alert type={userStorySubmitStatus.type} message={userStorySubmitStatus.message} />}

        <Input
          label="Nombre"
          name="name"
          value={userStoryFormData.name}
          onChange={handleUserStoryChange}
          required
          disabled={isCreatingUserStory}
          placeholder="Nombre de la historia de usuario"
        />

        <Textarea
          label="Descripción"
          name="description"
          value={userStoryFormData.description}
          onChange={handleUserStoryChange}
          required
          disabled={isCreatingUserStory}
          placeholder="Describe la historia de usuario..."
          rows={3}
        />

        <Input
          label="Peso"
          type="number"
          name="weight"
          value={userStoryFormData.weight.toString()}
          onChange={handleUserStoryChange}
          required
          disabled={isCreatingUserStory}
          placeholder="1"
          min="1"
        />
      </Modal>
    </section>
  );
}
