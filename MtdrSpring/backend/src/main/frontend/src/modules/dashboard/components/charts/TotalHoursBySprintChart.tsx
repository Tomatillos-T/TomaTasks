import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Loader2 } from "lucide-react";
import { useTotalHoursBySprint } from "@/modules/dashboard/hooks/useChartData";
import CustomChartTooltip from "./CustomChartTooltip";

const TotalHoursBySprintChart: React.FC = () => {
  const { data, isLoading, isError, error } = useTotalHoursBySprint();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-main" />
          <p className="text-text-secondary">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-error-bg border border-error-main rounded-lg p-6">
        <h3 className="text-error-main font-semibold mb-2">
          Error Loading Chart
        </h3>
        <p className="text-text-secondary text-sm">
          {error instanceof Error ? error.message : "Failed to load chart data"}
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-warning-bg border border-warning-main rounded-lg p-6">
        <p className="text-text-secondary">No data available</p>
      </div>
    );
  }

  // Transform data for Recharts - extract only sprint number for X-axis
  const chartData = data.map((item) => {
    // Extract sprint number from name like "Sprint 1" -> "1"
    const sprintNumber = item.sprintName.split("-")[0].trim();
    return {
      name: sprintNumber,
      fullName: item.sprintName, // Keep full name for tooltip
      "Hours Invested": item.totalHours,
    };
  });

  return (
    <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Gráfica 1: Horas Totales Trabajadas por Sprint
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#666", fontSize: 12 }}
            angle={0}
            textAnchor="middle"
            height={40}
          />
          <YAxis
            label={{
              value: "Hours",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#666" },
            }}
            tick={{ fill: "#666", fontSize: 12 }}
          />
          <Tooltip
            content={<CustomChartTooltip labelKey="fullName" />}
            wrapperStyle={{
              outline: "none",
            }}
            cursor={{ fill: "rgba(155, 135, 245, 0.1)" }}
          />
          <Legend />
          <Bar dataKey="Hours Invested" fill="#9b87f5" radius={[8, 8, 0, 0]}>
            <LabelList
              dataKey="Hours Invested"
              position="top"
              className="fill-text-primary"
              style={{ fontSize: "12px", fontWeight: "600" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalHoursBySprintChart;
