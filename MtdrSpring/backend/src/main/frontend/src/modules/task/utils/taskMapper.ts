import type { TaskDTO } from "@/modules/task/models/taskDTO";
import type Task from "@/modules/task/models/task";
import { TaskStatus } from "@/modules/task/models/taskStatus";

/**
 * Maps backend TaskDTO to frontend Task model
 */
export function mapTaskDTOToTask(dto: TaskDTO): Task {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    estimation: dto.timeEstimate,
    status: mapStatusToEnum(dto.status),
    userStory: {
      id: dto.userStoryId || "",
      name: dto.userStoryName || "",
    },
    sprint: {
      id: dto.sprintId || "",
      name: dto.sprintName || "",
    },
    assignee: {
      id: dto.assigneeId || "",
      name: dto.assigneeName || "",
    },
    startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
    endDate: dto.endDate ? new Date(dto.endDate) : new Date(),
    deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : new Date(),
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
