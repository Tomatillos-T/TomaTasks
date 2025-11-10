import { useState } from "react";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Textarea from "@/components/TextArea";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import InfiniteSelect from "@/components/InfiniteSelect";
import createTaskAdapter from "@/modules/task/adapters/createTaskAdapter";
import { useQueryClient } from "@tanstack/react-query";
import useInfiniteUsers from "@/modules/users/hooks/useInfiniteUsers";
import useInfiniteSprints from "@/modules/sprint/hooks/useInfiniteSprints";
import useInfiniteUserStories from "@/modules/userStory/hooks/useInfiniteUserStories";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
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

  const {
    userStories,
    isLoading: isLoadingUserStories,
    isFetchingNextPage: isFetchingNextPageUserStories,
    hasNextPage: hasNextPageUserStories,
    fetchNextPage: fetchNextPageUserStories,
  } = useInfiniteUserStories();

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

        <InfiniteSelect
          label="Historia de Usuario"
          value={userStoryId}
          onChange={setUserStoryId}
          items={userStories}
          getItemId={(story) => story.id}
          getItemLabel={(story) => story.name}
          isLoading={isLoadingUserStories}
          hasNextPage={hasNextPageUserStories}
          fetchNextPage={fetchNextPageUserStories}
          isFetchingNextPage={isFetchingNextPageUserStories}
          placeholder="Seleccione una historia de usuario"
        />
      </div>
    </Modal>
  );
}
