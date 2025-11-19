import { TaskStatus } from "@/modules/task/models/taskStatus";
import { TaskPriority, TaskEstimation } from "@/modules/task/models/taskEnums";

export default interface Task {
  id: string;
  name: string;
  description: string;
  estimation: number;
  status: TaskStatus;

  // New fields added
  timeTaken?: number | null;
  priority?: TaskPriority | null;
  complexityEstimation?: TaskEstimation | null;

  userStory: {
    id: string | null;
    name: string | null;
  };
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
