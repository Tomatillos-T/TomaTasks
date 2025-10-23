import { TaskStatus } from "./taskStatus";

export default interface Task {
  id: string;
  name: string;
  description: string;
  estimation: number;
  status: TaskStatus;
  userStory: {
    id: string;
    name: string;
  };
  sprint: {
    id: string;
    name: string;
  };
  assignee: {
    id: string;
    name: string;
  };
  startDate: Date;
  endDate: Date;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
