/**
 * Task Priority Enum
 * Must match backend values exactly (uppercase)
 */
export enum TaskPriority {
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

/**
 * Task Estimation Enum (T-shirt sizing)
 * Must match backend values exactly (uppercase)
 */
export enum TaskEstimation {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

/**
 * Human-readable labels for Priority
 */
export const priorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.URGENT]: "Urgente",
  [TaskPriority.HIGH]: "Alta",
  [TaskPriority.MODERATE]: "Moderada",
  [TaskPriority.LOW]: "Baja",
};

/**
 * Human-readable labels for Estimation
 */
export const estimationLabels: Record<TaskEstimation, string> = {
  [TaskEstimation.XS]: "XS - Extra Chico",
  [TaskEstimation.S]: "S - Chico",
  [TaskEstimation.M]: "M - Mediano",
  [TaskEstimation.L]: "L - Grande",
  [TaskEstimation.XL]: "XL - Extra Grande",
  [TaskEstimation.XXL]: "XXL - Extra Extra Grande",
};

/**
 * Color configuration for Priority badges
 * Uses theme-aware CSS variables for light/dark mode support
 */
export const priorityColors: Record<
  TaskPriority,
  { bg: string; text: string }
> = {
  [TaskPriority.URGENT]: {
    bg: "bg-error-bg",
    text: "text-error-dark",
  },
  [TaskPriority.HIGH]: {
    bg: "bg-warning-bg",
    text: "text-warning-dark",
  },
  [TaskPriority.MODERATE]: {
    bg: "bg-info-bg",
    text: "text-info-dark",
  },
  [TaskPriority.LOW]: {
    bg: "bg-success-bg",
    text: "text-success-dark",
  },
};

/**
 * Color configuration for Estimation badges
 * Uses theme-aware CSS variables for light/dark mode support
 */
export const estimationColors: Record<
  TaskEstimation,
  { bg: string; text: string }
> = {
  [TaskEstimation.XXL]: {
    bg: "bg-error-bg",
    text: "text-error-dark",
  },
  [TaskEstimation.XL]: {
    bg: "bg-warning-bg",
    text: "text-warning-dark",
  },
  [TaskEstimation.L]: {
    bg: "bg-info-bg",
    text: "text-info-dark",
  },
  [TaskEstimation.M]: {
    bg: "bg-success-bg",
    text: "text-success-dark",
  },
  [TaskEstimation.S]: {
    bg: "bg-primary-main",
    text: "text-primary-contrast",
  },
  [TaskEstimation.XS]: {
    bg: "bg-secondary-main",
    text: "text-secondary-contrast",
  },
};

/**
 * Filter options for Priority (for DataTable)
 */
export const priorityFilterOptions = [
  { label: "Urgente", value: TaskPriority.URGENT },
  { label: "Alta", value: TaskPriority.HIGH },
  { label: "Moderada", value: TaskPriority.MODERATE },
  { label: "Baja", value: TaskPriority.LOW },
];

/**
 * Filter options for Estimation (for DataTable)
 */
export const estimationFilterOptions = [
  { label: "XS - Muy Simple", value: TaskEstimation.XS },
  { label: "S - Simple", value: TaskEstimation.S },
  { label: "M - Mediano", value: TaskEstimation.M },
  { label: "L - Complejo", value: TaskEstimation.L },
  { label: "XL - Muy Complejo", value: TaskEstimation.XL },
  { label: "XXL - Extremadamente Complejo", value: TaskEstimation.XXL },
];
