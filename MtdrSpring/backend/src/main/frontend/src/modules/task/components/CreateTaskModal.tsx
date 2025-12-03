import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Textarea from "@/components/TextArea";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import InfiniteSelect from "@/components/InfiniteSelect";
import Select from "@/components/Select";
import createTaskAdapter from "@/modules/task/adapters/createTaskAdapter";
import updateTaskAdapter from "@/modules/task/adapters/updateTaskAdapter";
import { useQueryClient } from "@tanstack/react-query";
import useInfiniteUsers from "@/modules/users/hooks/useInfiniteUsers";
import useInfiniteSprints from "@/modules/sprint/hooks/useInfiniteSprints";
import type Task from "@/modules/task/models/task";
import {
  TaskPriority,
  TaskEstimation,
  priorityLabels,
  estimationLabels,
} from "@/modules/task/models/taskEnums";
import { mapStatusToBackend } from "@/modules/task/utils/taskMapper";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null; // Optional task for edit mode
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  task = null,
}: CreateTaskModalProps) {
  const isEditMode = !!task;
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeEstimate, setTimeEstimate] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [estimation, setEstimation] = useState<TaskEstimation | "">("");
  const [assigneeId, setAssigneeId] = useState("");
  const [sprintId, setSprintId] = useState("");

  // Populate form when task prop changes (edit mode)
  useEffect(() => {
    if (task) {
      setName(task.name || "");
      setDescription(task.description || "");
      setTimeEstimate(task.timeEstimate || 0);
      setTimeTaken(task.timeTaken || 0);
      setPriority(task.priority || "");
      setEstimation(task.estimation || "");
      setAssigneeId(task.assignee?.id || "");
      setSprintId(task.sprint?.id || "");
    }
  }, [task]);

  // Infinite query hooks
  const {
    users,
    isLoading: isLoadingUsers,
    isFetchingNextPage: isFetchingNextPageUsers,
    hasNextPage: hasNextPageUsers,
    fetchNextPage: fetchNextPageUsers,
  } = useInfiniteUsers();

  const {
    sprints,
    isLoading: isLoadingSprints,
    isFetchingNextPage: isFetchingNextPageSprints,
    hasNextPage: hasNextPageSprints,
    fetchNextPage: fetchNextPageSprints,
  } = useInfiniteSprints();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("El nombre de la tarea es requerido");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const taskData = {
      name,
      description,
      timeEstimate,
      timeTaken,
      priority: priority || undefined,
      estimation: estimation || undefined,
      assigneeId: assigneeId || undefined,
      sprintId: sprintId || undefined,
    };

    const result = isEditMode && task
      ? await updateTaskAdapter(task.id, {
          ...taskData,
          status: mapStatusToBackend(task.status),
        })
      : await createTaskAdapter(taskData);

    setIsSubmitting(false);

    if (result.status === 200) {
      setSuccess(result.message);
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Also invalidate kanban queries if editing
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["kanban-tasks"] });
      }
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
    setTimeTaken(0);
    setPriority("");
    setEstimation("");
    setAssigneeId("");
    setSprintId("");
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
      title={isEditMode ? "Editar Tarea" : "Crear Nueva Tarea"}
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
            {isEditMode ? "Guardar Cambios" : "Crear Tarea"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

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

        <div className={isEditMode ? "grid grid-cols-2 gap-4" : ""}>
          <Input
            label="Estimación de tiempo (horas)"
            type="number"
            name="timeEstimate"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(Number(e.target.value))}
            min={0}
            placeholder="0"
          />
          {isEditMode && (
            <Input
              label="Tiempo invertido (horas)"
              type="number"
              name="timeTaken"
              value={timeTaken}
              onChange={(e) => setTimeTaken(Number(e.target.value))}
              min={0}
              placeholder="0"
            />
          )}
        </div>

        <Select
          label="Prioridad"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority | "")}
          options={[
            { value: "", label: "Sin prioridad" },
            ...Object.values(TaskPriority).map((p) => ({
              value: p,
              label: priorityLabels[p],
            })),
          ]}
        />

        <Select
          label="Complejidad (T-shirt sizing)"
          value={estimation}
          onChange={(e) => setEstimation(e.target.value as TaskEstimation | "")}
          options={[
            { value: "", label: "Sin estimación de complejidad" },
            ...Object.values(TaskEstimation).map((e) => ({
              value: e,
              label: estimationLabels[e],
            })),
          ]}
        />

        <InfiniteSelect
          label="Asignar a usuario"
          value={assigneeId}
          onChange={setAssigneeId}
          items={users}
          getItemId={(user) => user.id}
          getItemLabel={(user) => `${user.firstName} ${user.lastName}`}
          isLoading={isLoadingUsers}
          hasNextPage={hasNextPageUsers}
          fetchNextPage={fetchNextPageUsers}
          isFetchingNextPage={isFetchingNextPageUsers}
          placeholder="Seleccione un usuario"
        />

        <InfiniteSelect
          label="Sprint"
          value={sprintId}
          onChange={setSprintId}
          items={sprints}
          getItemId={(sprint) => sprint.id}
          getItemLabel={(sprint) => sprint.description}
          isLoading={isLoadingSprints}
          hasNextPage={hasNextPageSprints}
          fetchNextPage={fetchNextPageSprints}
          isFetchingNextPage={isFetchingNextPageSprints}
          placeholder="Seleccione un sprint"
        />
      </div>
    </Modal>
  );
}
