import { TaskStatus } from "./taskStatus";

export default interface Task {
  id: string;
  name: string;
  description: string;
  estimation: number;
  status: TaskStatus;
  userStory: string;
  sprint: string;
  asignee: string;
  startDate: Date;
  endDate: Date;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
