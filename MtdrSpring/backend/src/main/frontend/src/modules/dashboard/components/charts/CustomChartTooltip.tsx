import React from "react";

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    dataKey?: string;
    color?: string;
    payload?: Record<string, any>;
  }>;
  label?: string;
  labelKey?: string;
}

const CustomChartTooltip: React.FC<CustomChartTooltipProps> = ({
  active,
  payload,
  label,
  labelKey = "fullName",
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const displayLabel = labelKey && payload[0]?.payload?.[labelKey]
    ? payload[0].payload[labelKey]
    : label;

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(204, 204, 204, 0.5)",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        padding: "12px",
      }}
    >
      {displayLabel && (
        <p style={{ fontWeight: 600, marginBottom: "8px", color: "#333" }}>
          {displayLabel}
        </p>
      )}
      {payload.map((entry, index) => (
        <p
          key={`item-${index}`}
          style={{
            color: entry.color || "#666",
            fontWeight: 500,
            marginBottom: index < payload.length - 1 ? "4px" : "0",
          }}
        >
          {`${entry.name || entry.dataKey}: ${entry.value}`}
        </p>
      ))}
    </div>
  );
};

export default CustomChartTooltip;
