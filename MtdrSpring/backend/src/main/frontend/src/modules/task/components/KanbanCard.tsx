import React, { memo } from "react";
import { Clock, User } from "lucide-react";
import type Task from "@/modules/task/models/task";
import { TaskStatus } from "@/modules/task/models/taskStatus";

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
      {/* Task Name */}
      <h4 className="text-sm font-semibold text-text-primary mb-2 line-clamp-2">
        {task.name}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* User Story Tag */}
      {task.userStory?.name && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-main/10 text-primary-main">
            {task.userStory.name}
          </span>
        </div>
      )}

      {/* Footer: Assignee and Estimation */}
      <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-border">
        {/* Assignee */}
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span className="truncate max-w-[100px]">
            {task.assignee?.name || "Sin asignar"}
          </span>
        </div>

        {/* Time Estimation */}
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{task.estimation}h</span>
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
