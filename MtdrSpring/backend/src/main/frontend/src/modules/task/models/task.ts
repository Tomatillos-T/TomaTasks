import { TaskStatus } from "@/modules/task/models/taskStatus";
import { TaskPriority, TaskEstimation } from "@/modules/task/models/taskEnums";

export default interface Task {
  id: string;
  name: string;
  description: string;
  timeEstimate: number;
  status: TaskStatus;

  // New fields added
  timeTaken?: number | null;
  priority?: TaskPriority | null;
  estimation?: TaskEstimation | null;

  sprint: {
    id: string | null;
    name: string | null;
  };
  assignee: {
    id: string | null;
    name: string | null;
  };
  startDate: Date | null;
  endDate: Date | null;
  deliveryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
