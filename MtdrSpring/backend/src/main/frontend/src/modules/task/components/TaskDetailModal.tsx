import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Target,
  AlertCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/AlertDialog";
import type Task from "@/modules/task/models/task";
import { TaskStatus } from "@/modules/task/models/taskStatus";
import {
  priorityLabels,
  priorityColors,
  estimationLabels,
  estimationColors,
} from "@/modules/task/models/taskEnums";
import type { BadgeProps } from "@/components/Badge";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  isDeleting?: boolean;
}

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  isDeleting = false,
}: TaskDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const formatDate = (date: Date | null) => {
    if (!date) return "No especificada";
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "No especificada";
    return new Date(date).toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = (status: TaskStatus): BadgeProps["variant"] => {
    const variantMap: Record<TaskStatus, BadgeProps["variant"]> = {
      [TaskStatus.DONE]: "done",
      [TaskStatus.INPROGRESS]: "inprogress",
      [TaskStatus.PENDING]: "pending",
      [TaskStatus.TODO]: "todo",
      [TaskStatus.TESTING]: "testing",
    };
    return variantMap[status] || "default";
  };

  const getStatusLabel = (status: TaskStatus): string => {
    const labelMap: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: "Por Hacer",
      [TaskStatus.INPROGRESS]: "En Progreso",
      [TaskStatus.TESTING]: "En Revisión",
      [TaskStatus.DONE]: "Completada",
      [TaskStatus.PENDING]: "Pendiente",
    };
    return labelMap[status] || status;
  };

  const isOverBudget =
    task.timeTaken !== null &&
    task.timeTaken !== undefined &&
    task.timeTaken > task.timeEstimate;

  const handleDelete = async () => {
    await onDelete(task.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title=""
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-text-primary flex-1">
                {task.name}
              </h2>
              <Badge variant={getStatusVariant(task.status)}>
                {getStatusLabel(task.status)}
              </Badge>
            </div>

            {/* Priority and Estimation Badges */}
            <div className="flex flex-wrap gap-2">
              {task.priority && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    priorityColors[task.priority].bg
                  } ${priorityColors[task.priority].text}`}
                >
                  <Target className="w-3.5 h-3.5 mr-1.5" />
                  {priorityLabels[task.priority]}
                </span>
              )}
              {task.estimation && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    estimationColors[task.estimation].bg
                  } ${estimationColors[task.estimation].text}`}
                >
                  {estimationLabels[task.estimation]}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                Descripción
              </h3>
              <p className="text-text-primary bg-background-subtle rounded-lg p-4">
                {task.description}
              </p>
            </div>
          )}

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background-subtle rounded-lg p-4">
              <div className="flex items-center gap-2 text-text-secondary mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Tiempo Estimado</span>
              </div>
              <p className="text-lg font-bold text-text-primary">
                {task.timeEstimate} horas
              </p>
            </div>
            <div
              className={`rounded-lg p-4 ${
                isOverBudget ? "bg-error-bg" : "bg-background-subtle"
              }`}
            >
              <div
                className={`flex items-center gap-2 mb-1 ${
                  isOverBudget ? "text-error-main" : "text-text-secondary"
                }`}
              >
                {isOverBudget ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">Tiempo Invertido</span>
              </div>
              <p
                className={`text-lg font-bold ${
                  isOverBudget ? "text-error-main" : "text-text-primary"
                }`}
              >
                {task.timeTaken !== null && task.timeTaken !== undefined
                  ? `${task.timeTaken} horas`
                  : "Sin registrar"}
              </p>
              {isOverBudget && (
                <p className="text-xs text-error-main mt-1">
                  Excedido por{" "}
                  {(task.timeTaken! - task.timeEstimate).toFixed(1)} horas
                </p>
              )}
            </div>
          </div>

          {/* Assignee and Sprint */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Asignado a</span>
              </div>
              <p className="text-text-primary font-medium">
                {task.assignee?.name || "Sin asignar"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Sprint</span>
              </div>
              <p className="text-text-primary font-medium">
                {task.sprint?.name || "Sin sprint"}
              </p>
            </div>
          </div>

          {/* Dates Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fechas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-background-subtle rounded-lg p-3">
                <p className="text-xs text-text-secondary mb-1">Inicio</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(task.startDate)}
                </p>
              </div>
              <div className="bg-background-subtle rounded-lg p-3">
                <p className="text-xs text-text-secondary mb-1">Entrega</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(task.deliveryDate)}
                </p>
              </div>
              <div className="bg-background-subtle rounded-lg p-3">
                <p className="text-xs text-text-secondary mb-1">Finalizada</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(task.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-background-contrast pt-4">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Creada: {formatDateTime(task.createdAt)}</span>
              <span>Actualizada: {formatDateTime(task.updatedAt)}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-error-main" />
              ¿Eliminar tarea?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar la tarea{" "}
              <span className="font-semibold">"{task.name}"</span>. Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
