import { AlertCircle, RefreshCw, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import KanbanColumn from "@/modules/task/components/KanbanColumn";
import useKanban from "@/modules/task/hooks/useKanban";
import Alert from "@/components/Alert";
import Button from "@/components/Button";

export default function KanbanBoard() {
  const navigate = useNavigate();
  const {
    columns,
    isLoading,
    isError,
    error,
    handleDragStart,
    handleDragOver,
    handleDrop
  } = useKanban();

  // Only show full loading on initial load when all columns are loading
  const isInitialLoading = isLoading && columns.every(col => col.tasks.length === 0);

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary-main animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Cargando tablero Kanban...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert
          type="error"
          message={`Error al cargar tareas: ${error?.message || "Error desconocido"}`}
        />
        <div className="mt-4 text-center">
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Tablero Kanban
          </h2>
          <p className="text-text-secondary">
            Arrastra y suelta las tareas para cambiar su estado. Haz scroll en cada columna para cargar más tareas.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/generate-dummy-tasks")}
        >
          <FlaskConical className="w-4 h-4 mr-2" />
          Generar Tareas Dummy
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto flex-1 min-h-0 pb-2">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && columns.every((col) => col.tasks.length === 0) && (
        <div className="text-center py-12 bg-background-paper rounded-lg border border-border mt-4 flex-shrink-0">
          <AlertCircle className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-text-primary">
            No hay tareas disponibles
          </p>
          <p className="text-sm text-text-secondary mt-2">
            Crea nuevas tareas para comenzar a usar el tablero Kanban
          </p>
        </div>
      )}
    </div>
  );
}
