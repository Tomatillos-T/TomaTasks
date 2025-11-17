import { useState } from "react";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import Input from "@/components/Input";

export default function GenerateDummyTasks() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tasksPerStatus, setTasksPerStatus] = useState(15);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info" | null;
    message: string;
  }>({ type: null, message: "" });

  const taskNames = [
    "Implementar autenticación de usuarios",
    "Diseñar interfaz de usuario",
    "Configurar base de datos",
    "Crear endpoints de API",
    "Escribir pruebas unitarias",
    "Optimizar rendimiento",
    "Refactorizar código legacy",
    "Documentar funcionalidad",
    "Revisar código del equipo",
    "Configurar CI/CD pipeline",
    "Implementar caché Redis",
    "Añadir validación de formularios",
    "Corregir bugs reportados",
    "Actualizar dependencias",
    "Mejorar accesibilidad",
    "Implementar dark mode",
    "Crear componentes reutilizables",
    "Integrar servicio de notificaciones",
    "Añadir logs de errores",
    "Optimizar consultas SQL",
    "Implementar búsqueda avanzada",
    "Crear dashboard de métricas",
    "Añadir exportación de datos",
    "Implementar paginación",
    "Configurar monitoreo",
  ];

  const descriptions = [
    "Tarea importante para el proyecto",
    "Requiere revisión del equipo",
    "Prioridad alta",
    "Dependencia con otras tareas",
    "Completar antes del sprint",
    "Investigación necesaria",
    "Requiere coordinación con backend",
    "Tarea de mantenimiento",
    "Mejora de UX",
    "Optimización de rendimiento",
  ];

  const statuses = ["TODO", "IN_PROGRESS", "TESTING", "DONE"];

  const generateTasks = async () => {
    setIsGenerating(true);
    setStatus({ type: "info", message: "Generando tareas dummy..." });

    try {
      let totalCreated = 0;
      const token = localStorage.getItem("jwtToken") || "";

      // Generate tasks for each status
      for (const taskStatus of statuses) {
        for (let i = 0; i < tasksPerStatus; i++) {
          const randomName =
            taskNames[Math.floor(Math.random() * taskNames.length)];
          const randomDesc =
            descriptions[Math.floor(Math.random() * descriptions.length)];
          const randomEstimate = Math.floor(Math.random() * 8) + 1; // 1-8 hours

          const taskData = {
            name: `${randomName} #${totalCreated + 1}`,
            description: `${randomDesc} - Tarea de prueba para el tablero Kanban`,
            timeEstimate: randomEstimate,
            status: taskStatus,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: null,
            sprintId: null,
            userStoryId: null,
          };

          const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(taskData),
          });

          if (response.ok) {
            totalCreated++;
            setStatus({
              type: "info",
              message: `Creando tareas... ${totalCreated}/${tasksPerStatus * 4}`,
            });
          } else {
            console.error("Error creating task:", await response.text());
          }
        }
      }

      setStatus({
        type: "success",
        message: `✅ Se crearon ${totalCreated} tareas dummy exitosamente. Ve al Kanban para verlas.`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: `Error al generar tareas: ${(error as Error).message}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteAllTasks = async () => {
    if (
      !window.confirm(
        "⚠️ ¿Estás seguro de que quieres eliminar TODAS las tareas? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setIsGenerating(true);
    setStatus({ type: "info", message: "Obteniendo todas las tareas..." });

    try {
      const token = localStorage.getItem("jwtToken") || "";

      // Get all tasks
      const response = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener tareas");
      }

      const tasks = await response.json();

      setStatus({
        type: "info",
        message: `Eliminando ${tasks.length} tareas...`,
      });

      let deleted = 0;
      for (const task of tasks) {
        const deleteResponse = await fetch(`/api/tasks/${task.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (deleteResponse.ok) {
          deleted++;
          setStatus({
            type: "info",
            message: `Eliminando tareas... ${deleted}/${tasks.length}`,
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      setStatus({
        type: "success",
        message: `✅ Se eliminaron ${deleted} tareas exitosamente.`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: `Error al eliminar tareas: ${(error as Error).message}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Generador de Tareas Dummy
        </h1>
        <p className="text-text-secondary">
          Genera tareas de prueba para probar el infinite scroll del Kanban
        </p>
      </div>

      <div className="bg-background-paper rounded-lg p-6 shadow-lg space-y-6">
        {/* Configuration */}
        <div>
          <Input
            type="number"
            label="Tareas por estado (TODO, IN_PROGRESS, TESTING, DONE)"
            value={tasksPerStatus}
            onChange={(e) => setTasksPerStatus(Number(e.target.value))}
            disabled={isGenerating}
            min={1}
            max={50}
          />
          <p className="text-xs text-text-secondary mt-2">
            Total de tareas que se crearán: <strong>{tasksPerStatus * 4}</strong>
          </p>
        </div>

        {/* Status Message */}
        {status.type && (
          <Alert type={status.type} message={status.message} />
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={generateTasks}
            disabled={isGenerating}
            loading={isGenerating}
          >
            Generar Tareas Dummy
          </Button>

          <Button
            variant="secondary"
            onClick={deleteAllTasks}
            disabled={isGenerating}
          >
            Eliminar Todas las Tareas
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-info-bg rounded-lg border border-info-main/20">
          <h3 className="font-semibold text-info-main mb-2">
            📋 Instrucciones
          </h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>1. Ajusta la cantidad de tareas por estado</li>
            <li>2. Haz clic en "Generar Tareas Dummy"</li>
            <li>3. Ve a la página de Kanban para ver las tareas</li>
            <li>
              4. Haz scroll en cada columna para probar el infinite scroll
            </li>
            <li>5. Cuando termines, elimina todas las tareas dummy</li>
          </ul>
        </div>

        {/* Info */}
        <div className="mt-4 p-4 bg-warning-bg rounded-lg border border-warning-main/20">
          <h3 className="font-semibold text-warning-main mb-2">
            ⚠️ Advertencia
          </h3>
          <p className="text-sm text-text-secondary">
            Esta herramienta es solo para desarrollo y pruebas. Las tareas
            creadas son ficticias y deben eliminarse después de probar.
          </p>
        </div>
      </div>
    </div>
  );
}
