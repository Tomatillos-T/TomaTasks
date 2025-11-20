import React, { useState } from "react";
import useDashboard from "@/modules/dashboard/hooks/useDashboard";
import SprintSelector from "@/modules/dashboard/components/SprintSelector";
import StatCard from "@/components/StatCard";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Target,
  Loader2,
} from "lucide-react";

const UserDashboard: React.FC = () => {
  const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>(
    undefined
  );
  const { dashboard, isLoading, isError, error } = useDashboard(
    selectedSprintId
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-main" />
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-error-bg border border-error-main rounded-lg p-6">
        <h3 className="text-error-main font-semibold mb-2">
          Error Loading Dashboard
        </h3>
        <p className="text-text-secondary text-sm">
          {error instanceof Error
            ? error.message
            : "Failed to load dashboard data"}
        </p>
      </div>
    );
  }

  if (!dashboard || !dashboard.kpis) {
    return (
      <div className="bg-warning-bg border border-warning-main rounded-lg p-6">
        <p className="text-text-secondary">No dashboard data available</p>
      </div>
    );
  }

  const { kpis, sprintName } = dashboard;

  // Calculate percentage change (mock data for now - could be enhanced with historical comparison)
  const mockChangePercentage = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary">
              My Performance Dashboard
            </h1>
            <p className="text-text-secondary mt-1">
              {sprintName
                ? `Sprint: ${sprintName}`
                : "All Sprints - Personal Metrics"}
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[250px]">
            <SprintSelector
              value={selectedSprintId}
              onChange={setSelectedSprintId}
              label="Filter by Sprint"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* On-Time Completion Rate */}
        <StatCard
          title="On-Time Completion Rate"
          value={`${kpis.onTimeCompletionRate.toFixed(1)}%`}
          change={mockChangePercentage}
          icon={CheckCircle}
          status={
            kpis.onTimeCompletionRate >= 80
              ? "success"
              : kpis.onTimeCompletionRate >= 60
              ? "warning"
              : "error"
          }
        />

        {/* Completion Rate */}
        <StatCard
          title="Completion Rate"
          value={`${kpis.completionRate.toFixed(1)}%`}
          change={mockChangePercentage}
          icon={Target}
          status={
            kpis.completionRate >= 80
              ? "success"
              : kpis.completionRate >= 60
              ? "warning"
              : "error"
          }
        />

        {/* Incomplete Tasks */}
        <StatCard
          title="Incomplete Tasks"
          value={kpis.incompleteTasks.toString()}
          change={mockChangePercentage}
          icon={Clock}
          status={
            kpis.incompleteTasks === 0
              ? "success"
              : kpis.incompleteTasks <= 5
              ? "info"
              : "warning"
          }
        />

        {/* Late Deliveries */}
        <StatCard
          title="Late Deliveries"
          value={kpis.lateDeliveries.toString()}
          change={mockChangePercentage}
          icon={AlertTriangle}
          status={
            kpis.lateDeliveries === 0
              ? "success"
              : kpis.lateDeliveries <= 2
              ? "warning"
              : "error"
          }
        />

        {/* Completed Tasks */}
        <StatCard
          title="Completed Tasks"
          value={kpis.completedTasks.toString()}
          change={mockChangePercentage}
          icon={TrendingUp}
          status="success"
        />

        {/* Total Tasks */}
        <StatCard
          title="Total Tasks"
          value={kpis.totalTasks.toString()}
          change={mockChangePercentage}
          icon={TrendingUp}
          status="info"
        />
      </div>

      {/* Average Hours by Estimation Table */}
      <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Average Hours by Estimation
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-background-contrast">
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                  Estimation
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                  Average Hours
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(kpis.avgHoursByEstimation).map(
                ([estimation, avgHours]) => {
                  // Define expected hours for each estimation size
                  const expectedHours: Record<string, number> = {
                    XS: 2,
                    S: 4,
                    M: 8,
                    L: 16,
                    XL: 32,
                    XXL: 64,
                  };

                  const expected = expectedHours[estimation] || 8;
                  const variance =
                    ((avgHours - expected) / expected) * 100;

                  return (
                    <tr
                      key={estimation}
                      className="border-b border-background-contrast hover:bg-background-default transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-text-primary">
                          {estimation}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-text-primary">
                          {avgHours.toFixed(1)} hrs
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            Math.abs(variance) <= 10
                              ? "bg-success-bg text-success-dark"
                              : Math.abs(variance) <= 25
                              ? "bg-warning-bg text-warning-dark"
                              : "bg-error-bg text-error-dark"
                          }`}
                        >
                          {variance > 0 ? "+" : ""}
                          {variance.toFixed(0)}% vs expected
                        </span>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-text-secondary mb-1">On-Time Tasks</p>
            <p className="text-2xl font-bold text-text-primary">
              {kpis.onTimeTasks} / {kpis.completedTasks}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">
              Tasks in Progress
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {kpis.incompleteTasks}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Late Tasks</p>
            <p className="text-2xl font-bold text-text-primary">
              {kpis.lateDeliveries}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
