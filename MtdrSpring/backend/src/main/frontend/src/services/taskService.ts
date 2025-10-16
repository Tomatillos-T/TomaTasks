// services/taskService.ts
import { HttpClient } from "../services/httpClient";
import type { Task } from "../pages/task/Tareas";

export const getTasks = async (): Promise<Task[]> => {
  return HttpClient.get<Task[]>("/api/tasks", { auth: true });
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  return HttpClient.post<Task>("/api/tasks", task, { auth: true });
};

export const updateTask = async (
  taskId: string,
  task: Partial<Task>
): Promise<Task> => {
  return HttpClient.put<Task>(`/api/tasks/${taskId}`, task, { auth: true });
};

export const deleteTask = async (taskId: string): Promise<void> => {
  return HttpClient.delete<void>(`/api/tasks/${taskId}`, { auth: true });
};
