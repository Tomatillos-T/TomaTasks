// Backend DTO - matches what Java sends
export interface TaskDTO {
  id: string;
  name: string;
  description: string;
  timeEstimate: number;
  status: string;

  // New fields from backend
  timeTaken?: number | null;
  priority?: string | null;
  estimation?: string | null;

  startDate: string | null;
  endDate: string | null;
  deliveryDate: string | null;
  sprintId: string | null;
  assigneeId: string | null;
  // Denormalized fields from backend
  assigneeName: string | null;
  sprintName: string | null;
  // Nested objects (optional, only when includeNested=true)
  assignee?: { id: string; name: string } | null;
  sprint?: { id: string; name: string } | null;
  user?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}
