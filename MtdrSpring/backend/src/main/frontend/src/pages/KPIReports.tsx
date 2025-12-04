import { useUserContext } from "@/contexts/UserContext";
import { ShieldAlert } from "lucide-react";
import { isAdminRole } from "@/utils/roleMapper";
import TotalHoursBySprintChart from "@/modules/dashboard/components/charts/TotalHoursBySprintChart";
import HoursByDeveloperChart from "@/modules/dashboard/components/charts/HoursByDeveloperChart";
import TasksByDeveloperChart from "@/modules/dashboard/components/charts/TasksByDeveloperChart";
import LastSprintTasksReport from "@/modules/dashboard/components/charts/LastSprintTasksReport";

/**
 * KPI Reports Page - Release 1.2 Section 1
 * Shows required charts for project management analysis:
 * - Gráfica 1: Total hours worked per sprint
 * - Gráfica 2: Hours worked by developer per sprint
 * - Gráfica 3: Tasks completed by developer per sprint
 * - Report: Tasks completed in the last sprint
 *
 * Access: ADMIN role only
 */
export default function KPIReports() {
  const { user, isAuthenticated } = useUserContext();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-error-bg border border-error-main rounded-lg p-6 max-w-md">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-error-main flex-shrink-0" />
            <div>
              <h3 className="text-error-main font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-text-secondary text-sm">
                Please log in to view KPI reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has Admin role
  const isAdmin = isAdminRole(user.role);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-warning-bg border border-warning-main rounded-lg p-6 max-w-md">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-warning-main flex-shrink-0" />
            <div>
              <h3 className="text-warning-main font-semibold mb-2">
                Access Restricted
              </h3>
              <p className="text-text-secondary text-sm">
                Only administrators can view KPI reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-text-primary">
              KPI Reports - Release 1.2
            </h1>
            <p className="text-text-secondary">
              Análisis visual del desempeño individual por sprint y
              comparaciones entre miembros del equipo
            </p>
            <div className="bg-info-bg border border-info-main rounded-lg p-4 mt-2">
              <p className="text-sm text-info-dark">
                <strong>Objetivo:</strong> Mostrar KPIS WorkedHours y
                TaskCompleted para analizar el desempeño del equipo. Los datos
                mostrados son desde el 24 de Marzo hasta el sprint actual.
              </p>
            </div>
          </div>

          {/* Chart 1: Total Hours by Sprint */}
          <TotalHoursBySprintChart />

          {/* Chart 2: Hours by Developer per Sprint */}
          <HoursByDeveloperChart />

          {/* Chart 3: Tasks Completed by Developer per Sprint */}
          <TasksByDeveloperChart />

          {/* Report: Last Sprint Tasks */}
          <LastSprintTasksReport />

          {/* Footer Note */}
          <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Notas de Implementación
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
              <li>
                Las gráficas muestran datos reales del sistema desde el inicio
                del proyecto
              </li>
              <li>
                Solo se incluyen sprints con datos registrados (no se incluyen
                sprints vacíos)
              </li>
              <li>
                El reporte de tareas muestra únicamente tareas completadas
                (status DONE) del último sprint
              </li>
              <li>
                Los colores en la tabla de varianza indican precisión de
                estimación: verde (±10%), amarillo (±25%), rojo (&gt;25%)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
