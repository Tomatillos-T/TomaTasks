import React, { useState } from "react";
import useManagerDashboard from "@/modules/dashboard/hooks/useManagerDashboard";
import SprintSelector from "@/modules/dashboard/components/SprintSelector";
import StatCard from "@/components/StatCard";
import {
  CheckCircle,
  Clock,
  Timer,
  TrendingUp,
  Loader2,
  Users,
} from "lucide-react";

const ManagerDashboard: React.FC = () => {
  const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>(
    undefined
  );
  const { dashboard, isLoading, isError, error } =
    useManagerDashboard(selectedSprintId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-main" />
          <p className="text-text-secondary">Loading team dashboard...</p>
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

  const { kpis, sprintName, previousSprintKpis } = dashboard;

  // Debug: Log to check if previousSprintKpis is being received
  console.log("Current KPIs:", kpis);
  console.log("Previous Sprint KPIs:", previousSprintKpis);

  // Calculate percentage changes based on previous sprint data
  const calculateChange = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const onTimeRateChange = previousSprintKpis
    ? previousSprintKpis.onTimeCompletionRate - kpis.onTimeCompletionRate
    : 0;

  const incompleteTasksChange = previousSprintKpis
    ? calculateChange(kpis.incompleteTasks, previousSprintKpis.incompleteTasks)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary">
              Team Dashboard
            </h1>
            <p className="text-text-secondary mt-1">
              {sprintName
                ? `Sprint: ${sprintName}`
                : "All Sprints - Team-Wide Metrics"}
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

      {/* Alert for team-wide view */}
      <div className="bg-info-bg border border-info-main rounded-lg p-4 flex items-start gap-3">
        <Users className="w-5 h-5 text-info-main flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-info-dark">
            Team-Wide Metrics
          </p>
          <p className="text-sm text-text-secondary mt-1">
            This dashboard shows aggregated performance metrics for all team
            members.
          </p>
        </div>
      </div>

      {/* Team Performance Summary */}
      <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Team Performance Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-text-secondary mb-1">Total Tasks</p>
            <p className="text-2xl font-bold text-text-primary">
              {kpis.totalTasks}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              across all team members
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Completed Tasks</p>
            <p className="text-2xl font-bold text-text-primary">
              {kpis.completedTasks}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {((kpis.completedTasks / kpis.totalTasks) * 100).toFixed(1)}% of
              total
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">
              Tasks in Progress
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {kpis.incompleteTasks}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {((kpis.incompleteTasks / kpis.totalTasks) * 100).toFixed(1)}% of
              total
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">On-Time Tasks</p>
            <p className="text-2xl font-bold text-text-primary">
              {kpis.onTimeTasks}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {(
                ((kpis.completedTasks - kpis.lateDeliveries) /
                  kpis.completedTasks) *
                100
              ).toFixed(1)}
              % of completed
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Late Deliveries</p>
            <p className="text-2xl font-bold text-text-primary">
              {kpis.lateDeliveries}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {((kpis.lateDeliveries / kpis.completedTasks) * 100).toFixed(1)}%
              of completed
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Invested Hours */}
        <StatCard
          title="Total Invested Hours"
          value={`${kpis.totalInvestedHours.toFixed(1)}h`}
          change={
            previousSprintKpis
              ? calculateChange(
                  kpis.totalInvestedHours,
                  previousSprintKpis.totalInvestedHours
                )
              : 0
          }
          icon={Timer}
          status="info"
        />

        {/* Total Expected Hours */}
        <StatCard
          title="Total Expected Hours"
          value={`${kpis.totalExpectedHours.toFixed(1)}h`}
          change={
            ((kpis.totalExpectedHours - kpis.totalInvestedHours) /
              kpis.totalExpectedHours) *
            100
          }
          icon={TrendingUp}
          status={
            kpis.totalInvestedHours <= kpis.totalExpectedHours
              ? "success"
              : kpis.totalInvestedHours <= kpis.totalExpectedHours * 1.1
              ? "warning"
              : "error"
          }
        />

        {/* On-Time Completion Rate */}
        <StatCard
          title="Team On-Time Rate"
          value={`${kpis.onTimeCompletionRate.toFixed(1)}%`}
          change={onTimeRateChange}
          icon={CheckCircle}
          status={
            kpis.onTimeCompletionRate >= 80
              ? "success"
              : kpis.onTimeCompletionRate >= 60
              ? "warning"
              : "error"
          }
        />

        {/* Incomplete Tasks */}
        <StatCard
          title="Team Incomplete Tasks"
          value={kpis.incompleteTasks.toString()}
          change={incompleteTasksChange}
          icon={Clock}
          status={
            kpis.incompleteTasks === 0
              ? "success"
              : kpis.incompleteTasks <= 10
              ? "info"
              : "warning"
          }
        />
      </div>

      {/* Average Hours by Estimation Table */}
      <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Team Average Hours by Estimation
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-background-contrast">
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                  Estimation
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                  Expected Hours
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                  Team Average Hours
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                  Variance
                </th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Sort estimations by size (XS -> XXL)
                const estimationOrder = ["XS", "S", "M", "L", "XL", "XXL"];

                return Object.entries(kpis.avgHoursByEstimation)
                  .sort(([a], [b]) => {
                    return (
                      estimationOrder.indexOf(a) - estimationOrder.indexOf(b)
                    );
                  })
                  .map(([estimation, avgHours]) => {
                    // Get the average expected hours from backend data
                    const expectedHours =
                      kpis.avgExpectedHoursByEstimation[estimation] || 0;
                    const variance =
                      expectedHours > 0
                        ? ((avgHours - expectedHours) / expectedHours) * 100
                        : 0;

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
                          <span className="text-text-secondary">
                            {expectedHours.toFixed(1)} hrs
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-text-primary font-medium">
                            {avgHours.toFixed(1)} hrs
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              variance <= 5
                                ? "bg-success-bg text-success-dark"
                                : variance <= 25
                                ? "bg-warning-bg text-warning-dark"
                                : "bg-error-bg text-error-dark"
                            }`}
                          >
                            {variance > 0 ? "+" : ""}
                            {variance.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    );
                  });
              })()}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-secondary mt-4">
          * Variance shows the percentage difference between team average and
          expected hours
        </p>
      </div>
    </div>
  );
};

export default ManagerDashboard;
