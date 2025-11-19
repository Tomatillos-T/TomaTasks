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
  [TaskEstimation.XS]: "XS - Muy Simple",
  [TaskEstimation.S]: "S - Simple",
  [TaskEstimation.M]: "M - Mediano",
  [TaskEstimation.L]: "L - Complejo",
  [TaskEstimation.XL]: "XL - Muy Complejo",
  [TaskEstimation.XXL]: "XXL - Extremadamente Complejo",
};

/**
 * Color configuration for Priority badges
 */
export const priorityColors: Record<
  TaskPriority,
  { bg: string; text: string; border: string }
> = {
  [TaskPriority.URGENT]: {
    bg: "bg-red-500",
    text: "text-white",
    border: "border-red-600",
  },
  [TaskPriority.HIGH]: {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-600",
  },
  [TaskPriority.MODERATE]: {
    bg: "bg-yellow-500",
    text: "text-gray-900",
    border: "border-yellow-600",
  },
  [TaskPriority.LOW]: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-600",
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
