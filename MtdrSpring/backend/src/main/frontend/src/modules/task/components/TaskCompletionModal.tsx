import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import type Task from "@/modules/task/models/task";

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onConfirm: (timeTaken: number) => void;
  isSubmitting?: boolean;
}

export default function TaskCompletionModal({
  isOpen,
  onClose,
  task,
  onConfirm,
  isSubmitting = false,
}: TaskCompletionModalProps) {
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Reset and pre-fill with existing timeTaken or timeEstimate when task changes
  useEffect(() => {
    if (task) {
      // If task already has timeTaken, use that, otherwise suggest the estimate
      setTimeTaken(task.timeTaken ?? task.timeEstimate ?? 0);
      setError(null);
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = () => {
    if (timeTaken < 0) {
      setError("El tiempo no puede ser negativo");
      return;
    }
    if (timeTaken === 0) {
      setError("Por favor ingresa el tiempo invertido");
      return;
    }
    setError(null);
    onConfirm(timeTaken);
  };

  const isOverBudget = timeTaken > task.timeEstimate;
  const difference = Math.abs(timeTaken - task.timeEstimate);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || timeTaken <= 0}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completar Tarea
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-success-main" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Completar Tarea
          </h2>
          <p className="text-text-secondary">
            Ingresa el tiempo real invertido en esta tarea
          </p>
        </div>

        {/* Task Info */}
        <div className="bg-background-subtle rounded-lg p-4">
          <h3 className="font-semibold text-text-primary mb-2">{task.name}</h3>
          {task.description && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Time Estimate Reference */}
        <div className="flex items-center justify-between bg-info-bg rounded-lg p-4">
          <div className="flex items-center gap-2 text-info-main">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Tiempo Estimado</span>
          </div>
          <span className="text-lg font-bold text-info-main">
            {task.timeEstimate} horas
          </span>
        </div>

        {/* Time Taken Input */}
        <div className="space-y-2">
          <Input
            label="Tiempo Invertido (horas)"
            type="number"
            value={timeTaken}
            onChange={(e) => {
              setTimeTaken(Number(e.target.value));
              setError(null);
            }}
            min={0}
            step={0.5}
            error={error || undefined}
            required
          />

          {/* Comparison feedback */}
          {timeTaken > 0 && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                isOverBudget ? "bg-warning-bg" : "bg-success-bg"
              }`}
            >
              {isOverBudget ? (
                <>
                  <AlertCircle className="w-4 h-4 text-warning-main" />
                  <span className="text-sm text-warning-main">
                    Excedido por{" "}
                    <span className="font-semibold">{difference.toFixed(1)}</span>{" "}
                    horas respecto a la estimación
                  </span>
                </>
              ) : timeTaken < task.timeEstimate ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success-main" />
                  <span className="text-sm text-success-main">
                    Completado{" "}
                    <span className="font-semibold">{difference.toFixed(1)}</span>{" "}
                    horas antes de lo estimado
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success-main" />
                  <span className="text-sm text-success-main">
                    Completado exactamente en el tiempo estimado
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Note about delivery date */}
        <p className="text-xs text-text-secondary text-center">
          La fecha de entrega se establecerá automáticamente a hoy
        </p>
      </div>
    </Modal>
  );
}
