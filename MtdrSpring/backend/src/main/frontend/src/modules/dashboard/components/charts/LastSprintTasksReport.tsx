import React from "react";
import { Loader2 } from "lucide-react";
import { useLastSprintTasksReport } from "@/modules/dashboard/hooks/useChartData";

const LastSprintTasksReport: React.FC = () => {
  const { data, isLoading, isError, error } = useLastSprintTasksReport();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-main" />
          <p className="text-text-secondary">Loading report...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-error-bg border border-error-main rounded-lg p-6">
        <h3 className="text-error-main font-semibold mb-2">
          Error Loading Report
        </h3>
        <p className="text-text-secondary text-sm">
          {error instanceof Error ? error.message : "Failed to load report data"}
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-warning-bg border border-warning-main rounded-lg p-6">
        <p className="text-text-secondary">
          No completed tasks in the last sprint
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Reporte de Tareas Terminadas (Último Sprint)
      </h2>
      <p className="text-sm text-text-secondary mb-4">
        Ordenado por nombre de desarrollador
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-background-contrast">
              <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                Task Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                Developer
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-text-secondary">
                Estimated Hours
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-text-secondary">
                Actual Hours
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-text-secondary">
                Variance
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-text-secondary">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((task, index) => {
              const variance =
                task.estimatedHours && task.actualHours
                  ? task.actualHours - task.estimatedHours
                  : null;

              const variancePercentage =
                task.estimatedHours && task.actualHours && task.estimatedHours > 0
                  ? ((variance! / task.estimatedHours) * 100).toFixed(0)
                  : null;

              return (
                <tr
                  key={task.taskId}
                  className={`border-b border-background-contrast hover:bg-background-default transition-colors ${
                    index % 2 === 0 ? "bg-background-paper" : "bg-background-default"
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-text-primary">
                      {task.taskName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-text-primary">
                      {task.developerName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-text-primary">
                      {task.estimatedHours ?? "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-text-primary">
                      {task.actualHours ?? "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {variance !== null && variancePercentage !== null ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          Math.abs(Number(variancePercentage)) <= 10
                            ? "bg-success-bg text-success-dark"
                            : Math.abs(Number(variancePercentage)) <= 25
                            ? "bg-warning-bg text-warning-dark"
                            : "bg-error-bg text-error-dark"
                        }`}
                      >
                        {variance > 0 ? "+" : ""}
                        {variance}h ({variancePercentage}%)
                      </span>
                    ) : (
                      <span className="text-text-secondary text-sm">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === "DONE"
                          ? "bg-success-bg text-success-dark"
                          : "bg-info-bg text-info-dark"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-background-contrast">
        <p className="text-sm text-text-secondary">
          Total tasks completed in last sprint:{" "}
          <span className="font-semibold text-text-primary">{data.length}</span>
        </p>
      </div>
    </div>
  );
};

export default LastSprintTasksReport;
