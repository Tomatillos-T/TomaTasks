import type { TaskDTO } from "@/modules/task/models/taskDTO";
import type Task from "@/modules/task/models/task";
import { TaskStatus } from "@/modules/task/models/taskStatus";
import { TaskPriority, TaskEstimation } from "@/modules/task/models/taskEnums";

/**
 * Maps backend TaskDTO to frontend Task model
 */
export function mapTaskDTOToTask(dto: TaskDTO): Task {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    timeEstimate: dto.timeEstimate,
    status: mapStatusToEnum(dto.status),

    // New fields
    timeTaken: dto.timeTaken ?? null,
    priority: dto.priority ? mapPriorityToEnum(dto.priority) : null,
    estimation: dto.estimation
      ? mapEstimationToEnum(dto.estimation)
      : null,

    sprint: {
      id: dto.sprintId ?? null,
      name: dto.sprintName ?? null,
    },
    assignee: {
      id: dto.assigneeId ?? null,
      name: dto.assigneeName ?? null,
    },
    startDate: dto.startDate ? new Date(dto.startDate) : null,
    endDate: dto.endDate ? new Date(dto.endDate) : null,
    deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

/**
 * Maps string status to TaskStatus enum
 */
function mapStatusToEnum(status: string): TaskStatus {
  switch (status) {
    case "TODO":
      return TaskStatus.TODO;
    case "PENDING":
      return TaskStatus.PENDING;
    case "IN_PROGRESS":
      return TaskStatus.INPROGRESS;
    case "TESTING":
      return TaskStatus.TESTING;
    case "DONE":
      return TaskStatus.DONE;
    default:
      return TaskStatus.TODO;
  }
}

/**
 * Maps array of TaskDTOs to array of Tasks
 */
export function mapTaskDTOsToTasks(dtos: TaskDTO[]): Task[] {
  return dtos.map(mapTaskDTOToTask);
}

/**
 * Maps frontend TaskStatus enum to backend string value
 */
export function mapStatusToBackend(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return "TODO";
    case TaskStatus.PENDING:
      return "PENDING";
    case TaskStatus.INPROGRESS:
      return "IN_PROGRESS";
    case TaskStatus.TESTING:
      return "TESTING";
    case TaskStatus.DONE:
      return "DONE";
    default:
      return "TODO";
  }
}

/**
 * Maps string priority to TaskPriority enum
 */
function mapPriorityToEnum(priority: string): TaskPriority {
  switch (priority) {
    case "LOW":
      return TaskPriority.LOW;
    case "MODERATE":
      return TaskPriority.MODERATE;
    case "HIGH":
      return TaskPriority.HIGH;
    case "URGENT":
      return TaskPriority.URGENT;
    default:
      return TaskPriority.LOW;
  }
}

/**
 * Maps TaskPriority enum to backend string value
 */
export function mapPriorityToBackend(priority: TaskPriority | null | undefined): string | undefined {
  if (!priority) return undefined;
  return priority; // Already in correct format (uppercase)
}

/**
 * Maps string estimation to TaskEstimation enum
 */
function mapEstimationToEnum(estimation: string): TaskEstimation {
  switch (estimation) {
    case "XS":
      return TaskEstimation.XS;
    case "S":
      return TaskEstimation.S;
    case "M":
      return TaskEstimation.M;
    case "L":
      return TaskEstimation.L;
    case "XL":
      return TaskEstimation.XL;
    case "XXL":
      return TaskEstimation.XXL;
    default:
      return TaskEstimation.M;
  }
}

/**
 * Maps TaskEstimation enum to backend string value
 */
export function mapEstimationToBackend(
  estimation: TaskEstimation | null | undefined
): string | undefined {
  if (!estimation) return undefined;
  return estimation; // Already in correct format (uppercase)
}
