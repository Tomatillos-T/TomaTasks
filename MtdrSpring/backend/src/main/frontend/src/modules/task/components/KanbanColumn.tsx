import React, { useRef, useEffect, memo } from "react";
import { Loader2 } from "lucide-react";
import KanbanCard from "@/modules/task/components/KanbanCard";
import type { KanbanColumn as KanbanColumnType } from "@/modules/task/hooks/useKanban";
import { TaskStatus } from "@/modules/task/models/taskStatus";

interface KanbanColumnProps {
  column: KanbanColumnType;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, fromStatus: TaskStatus) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, toStatus: TaskStatus) => void;
}

const KanbanColumn = memo(function KanbanColumn({
  column,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  // Infinite scroll handler
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when scrolled to 80% of the container
      if (
        scrollPercentage > 0.8 &&
        column.hasNextPage &&
        !column.isFetchingNextPage
      ) {
        column.fetchNextPage();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [column.hasNextPage, column.isFetchingNextPage, column.fetchNextPage]);

  // Column color mapping
  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return "border-status-todo-main";
      case TaskStatus.INPROGRESS:
        return "border-status-inprogress-main";
      case TaskStatus.TESTING:
        return "border-status-testing-main";
      case TaskStatus.DONE:
        return "border-status-done-main";
      case TaskStatus.PENDING:
        return "border-status-pending-main";
      default:
        return "border-status-pending-main";
    }
  };

  const getHeaderColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return "bg-status-todo-main/10 text-status-todo-contrast";
      case TaskStatus.INPROGRESS:
        return "bg-status-inprogress-main/10 text-status-inprogress-contrast";
      case TaskStatus.TESTING:
        return "bg-status-testing-main/10 text-status-testing-contrast";
      case TaskStatus.DONE:
        return "bg-status-done-main/10 text-status-done-contrast";
      case TaskStatus.PENDING:
        return "bg-status-pending-main/10 text-status-pending-contrast";
      default:
        return "bg-status-pending-main/10 text-status-pending-contrast";
    }
  };

  return (
    <div
      className={`flex-1 min-w-[280px] bg-background-paper rounded-lg border-t-4 ${getColumnColor(
        column.id
      )} shadow-sm flex flex-col h-full`}
    >
      {/* Column Header */}
      <div
        className={`p-4 rounded-t-lg border-b border-border ${getHeaderColor(
          column.id
        )} flex-shrink-0`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface">
            {column.tasks.length}
          </span>
        </div>
      </div>

      {/* Column Content - Droppable Area */}
      <div
        ref={scrollContainerRef}
        onDragOver={(e) => {
          onDragOver(e);
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          onDrop(e, column.id);
          setIsDragOver(false);
        }}
        className={`p-4 space-y-3 flex-1 overflow-y-auto min-h-0 scrollbar-thin transition-colors ${
          isDragOver ? 'bg-primary-main/5' : ''
        }`}
      >
        {column.isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 text-primary-main animate-spin" />
          </div>
        ) : column.tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg">
            <p className="text-text-secondary text-sm">
              Arrastra tareas aquí
            </p>
          </div>
        ) : (
          <>
            {column.tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onDragStart={onDragStart}
              />
            ))}

            {/* Loading more indicator */}
            {column.isFetchingNextPage && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 text-primary-main animate-spin" />
              </div>
            )}

            {/* End of list indicator */}
            {!column.hasNextPage && column.tasks.length > 0 && (
              <div className="text-center py-2">
                <p className="text-xs text-text-secondary">
                  No hay más tareas
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default KanbanColumn;
