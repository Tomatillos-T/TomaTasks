import React from "react";

type StatusType = "success" | "error" | "warning" | "info";

type StatCardProps = {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  status: StatusType;
};

const colorClasses: Record<StatusType, { bg: string; text: string }> = {
  success: { bg: "bg-success-bg", text: "text-success-main" },
  error: { bg: "bg-error-bg", text: "text-error-main" },
  warning: { bg: "bg-warning-bg", text: "text-warning-main" },
  info: { bg: "bg-info-bg", text: "text-info-main" },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, status }) => (
  <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${colorClasses[status].bg}`}>
        <Icon className={`w-6 h-6 ${colorClasses[status].text}`} />
      </div>

      <span
        className={`text-sm font-semibold px-2 py-1 rounded-full ${
          change >= 0
            ? "bg-[var(--success-bg)] text-[var(--success-dark)]"
            : "bg-[var(--error-bg)] text-[var(--error-dark)]"
        }`}
      >
        {change >= 0 ? "+" : ""}
        {change}%
      </span>
    </div>

    <h3 className="text-sm font-medium mb-1 text-text-secondary">{title}</h3>
    <p className="text-2xl font-bold text-text-primary">{value}</p>
  </div>
);

export default StatCard;
