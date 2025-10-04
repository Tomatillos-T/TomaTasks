import React from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

type AlertProps = {
  type: "success" | "error" | "warning" | "info";
  message: string;
};

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const styles = {
    success: {
      bg: "bg-success-bg",
      text: "text-success-main",
      border: "border-success-main",
      contrast: "text-success-contrast",
    },
    error: {
      bg: "bg-error-bg",
      text: "text-error-main",
      border: "border-error-main",
      contrast: "text-error-contrast",
    },
    warning: {
      bg: "bg-warning-bg",
      text: "text-warning-main",
      border: "border-warning-main",
      contrast: "text-warning-contrast",
    },
    info: {
      bg: "bg-info-bg",
      text: "text-info-main",
      border: "border-info-main",
      contrast: "text-info-contrast",
    },
  } as const;

  const Icon = icons[type];
  const config = styles[type];

  return (
    <div className={`rounded-lg p-4 flex items-start gap-3 border ${config.border} ${config.bg}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.text}`} />
      <p className={`text-sm font-medium ${config.contrast}`}>{message}</p>
    </div>
  );
};

export default Alert;
