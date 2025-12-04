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
import { useHoursByDeveloperSprint } from "@/modules/dashboard/hooks/useChartData";
import CustomChartTooltip from "./CustomChartTooltip";

const DEVELOPER_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#84cc16", // Lime
];

const HoursByDeveloperChart: React.FC = () => {
  const { data, isLoading, isError, error } = useHoursByDeveloperSprint();

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

  // Transform data for grouped bar chart
  // Get all unique sprint names
  const sprintNames = Array.from(
    new Set(data.flatMap((dev) => Object.keys(dev.metricsBySprint)))
  ).sort();

  // Transform to format: [{name: "1", fullName: "Sprint 1 - Description", Dev1: 10, Dev2: 20, ...}, ...]
  const chartData = sprintNames.map((sprintName) => {
    // Extract sprint number from name like "Sprint 1" -> "1"
    const sprintNumber = sprintName.split("-")[0].trim();
    const dataPoint: Record<string, string | number> = {
      name: sprintNumber,
      fullName: sprintName,
    };
    data.forEach((developer) => {
      dataPoint[developer.developerName] =
        developer.metricsBySprint[sprintName] || 0;
    });
    return dataPoint;
  });

  return (
    <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Gráfica 2: Horas Trabajadas por Developer por Sprint
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#666", fontSize: 12 }}
            angle={0}
            textAnchor="end"
            height={50}
          />
          <YAxis
            label={{
              value: "Horas Trabajadas",
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
            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
          />
          <Legend />
          {data.map((developer, index) => (
            <Bar
              key={developer.developerId}
              dataKey={developer.developerName}
              fill={DEVELOPER_COLORS[index % DEVELOPER_COLORS.length]}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey={developer.developerName}
                position="top"
                className="fill-text-primary"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoursByDeveloperChart;
