import React, { memo } from "react";
import { Clock, User, AlertCircle } from "lucide-react";
import type Task from "@/modules/task/models/task";
import { TaskStatus } from "@/modules/task/models/taskStatus";
import {
  priorityLabels,
  priorityColors,
  estimationLabels,
  estimationColors,
} from "@/modules/task/models/taskEnums";

interface KanbanCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, fromStatus: TaskStatus) => void;
}

const KanbanCard = memo(function KanbanCard({ task, onDragStart }: KanbanCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id, task.status)}
      className="bg-surface border border-border rounded-lg p-4 cursor-move hover:shadow-md transition-all duration-200 group active:opacity-50 active:scale-95"
    >
      {/* Header: Task Name + Priority Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-text-primary line-clamp-2 flex-1">
          {task.name}
        </h4>
        {task.priority && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text}`}
          >
            {priorityLabels[task.priority]}
          </span>
        )}
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags: Complexity */}
      {task.estimation && (
        <div className="mb-3 flex flex-wrap gap-2">
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${estimationColors[task.estimation].bg} ${estimationColors[task.estimation].text}`}>
            {estimationLabels[task.estimation]}
          </span>
        </div>
      )}

      {/* Footer: Assignee and Time Information */}
      <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-border">
        {/* Assignee */}
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span className="truncate max-w-[100px]">
            {task.assignee?.name || "Sin asignar"}
          </span>
        </div>

        {/* Time Information */}
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {task.timeTaken !== null && task.timeTaken !== undefined ? (
            <span
              className={
                task.timeTaken > task.timeEstimate
                  ? "text-red-600 font-semibold flex items-center gap-0.5"
                  : ""
              }
            >
              {task.timeTaken}/{task.timeEstimate}h
              {task.timeTaken > task.timeEstimate && (
                <AlertCircle className="w-3 h-3" />
              )}
            </span>
          ) : (
            <span>{task.timeEstimate}h</span>
          )}
        </div>
      </div>

      {/* Sprint Tag (if exists) */}
      {task.sprint?.name && (
        <div className="mt-2">
          <span className="text-xs text-text-secondary">
            Sprint: {task.sprint.name}
          </span>
        </div>
      )}

      {/* Delivery Date */}
      {task.deliveryDate && (
        <div className="mt-2 text-xs text-text-secondary">
          Entrega: {formatDate(task.deliveryDate)}
        </div>
      )}
    </div>
  );
});

export default KanbanCard;
