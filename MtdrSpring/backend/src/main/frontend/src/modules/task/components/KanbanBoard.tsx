import { AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import KanbanColumn from "@/modules/task/components/KanbanColumn";
import useKanban from "@/modules/task/hooks/useKanban";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import useSprints from "@/modules/sprint/hooks/useSprints";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import { Badge } from "@/components/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/components/Command";
import { Separator } from "@/components/Separator";
import clsx from "clsx";
import {
  TaskPriority,
  TaskEstimation,
  priorityLabels,
  estimationLabels,
} from "@/modules/task/models/taskEnums";

interface KanbanFilterProps {
  title: string;
  options: { label: string; value: string }[];
  selectedValues: Set<string>;
  onSelect: (value: string) => void;
  onClear: () => void;
}

function KanbanFilter({
  title,
  options,
  selectedValues,
  onSelect,
  onClear,
}: KanbanFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed border-background-contrast"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} seleccionados
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No hay opciones disponibles</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onSelect(option.value)}
                  >
                    <div
                      className={clsx(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-background-contrast",
                        isSelected
                          ? "bg-primary-main text-primary-contrast"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={onClear}
                    className="justify-center text-center"
                  >
                    Limpiar
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function KanbanBoard() {
  const {
    columns,
    isLoading,
    isError,
    error,
    handleDragStart,
    handleDragOver,
    handleDrop,
    selectedPriorities,
    setSelectedPriorities,
    selectedEstimations,
    setSelectedEstimations,
    selectedSprintIds,
    setSelectedSprintIds,
  } = useKanban();

  const { sprints } = useSprints();
  const [filterView, setFilterView] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);

  // Track if component has rendered at least once
  useEffect(() => {
    setHasRendered(true);
  }, []);

  // Sort sprints by description/name
  const sortedSprints = [...sprints].sort((a, b) => {
    const nameA = a.description || a.name || '';
    const nameB = b.description || b.name || '';
    return nameA.localeCompare(nameB);
  });

  // Only show full page loading on true initial load (before first render)
  // After that, let individual columns show their loading state
  const isInitialLoading = !hasRendered && isLoading && columns.every(col => col.tasks.length === 0);

  const hasActiveFilters =
    selectedPriorities.length > 0 ||
    selectedEstimations.length > 0 ||
    selectedSprintIds.length > 0;

  const clearAllFilters = () => {
    setSelectedPriorities([]);
    setSelectedEstimations([]);
    setSelectedSprintIds([]);
  };

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
      <div className="mb-4 flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-3xl font-bold text-text-primary">
              Tablero Kanban
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Arrastra y suelta las tareas para cambiar su estado
            </p>
          </div>
        </div>

        {/* Compact Filter Toolbar */}
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 px-3"
                  onClick={() => setFilterView(!filterView)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  <span className="ml-2">Filtros</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{filterView ? 'Ocultar filtros' : 'Mostrar filtros'}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Collapsible Filter Section */}
          {filterView && (
            <>
              <div className="w-full h-[1px] bg-background-contrast rounded-full"></div>
              <div className="flex gap-2 flex-wrap">
                {/* Priority Filter */}
                <KanbanFilter
                  title="Prioridad"
                  options={Object.values(TaskPriority).map((p) => ({
                    label: priorityLabels[p],
                    value: p,
                  }))}
                  selectedValues={new Set(selectedPriorities)}
                  onSelect={(value) => {
                    setSelectedPriorities((prev: TaskPriority[]) =>
                      prev.includes(value as TaskPriority)
                        ? prev.filter((p: TaskPriority) => p !== value)
                        : [...prev, value as TaskPriority]
                    );
                  }}
                  onClear={() => setSelectedPriorities([])}
                />

                {/* Estimation Filter */}
                <KanbanFilter
                  title="Complejidad"
                  options={Object.values(TaskEstimation).map((e) => ({
                    label: estimationLabels[e],
                    value: e,
                  }))}
                  selectedValues={new Set(selectedEstimations)}
                  onSelect={(value) => {
                    setSelectedEstimations((prev: TaskEstimation[]) =>
                      prev.includes(value as TaskEstimation)
                        ? prev.filter((e: TaskEstimation) => e !== value)
                        : [...prev, value as TaskEstimation]
                    );
                  }}
                  onClear={() => setSelectedEstimations([])}
                />

                {/* Sprint Filter */}
                <KanbanFilter
                  title="Sprint"
                  options={sortedSprints.map((s) => ({
                    label: s.description || s.name || `Sprint ${s.id}`,
                    value: s.id,
                  }))}
                  selectedValues={new Set(selectedSprintIds)}
                  onSelect={(value) => {
                    setSelectedSprintIds((prev: string[]) =>
                      prev.includes(value)
                        ? prev.filter((id: string) => id !== value)
                        : [...prev, value]
                    );
                  }}
                  onClear={() => setSelectedSprintIds([])}
                />

                {/* Clear All Button */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="h-8 px-2 lg:px-3"
                  >
                    Reset
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
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
