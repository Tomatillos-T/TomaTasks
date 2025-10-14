import { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components//Button";
import Alert from "../../components//Alert";
import Modal from "../../components//Modal";
import Textarea from "../../components//TextArea";
import { HttpClient } from "../../services/httpClient";
import type { HttpError } from "../../services/httpClient";
import { Check } from "lucide-react";

export interface User {
  id: string;
  name: string;
}

export interface Sprint {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  timeEstimate?: number;
  actualHours?: number;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PENDING" | "TESTING";
  startDate?: string;
  endDate?: string;
  deliveryDate?: string;
  userStory?: { id: string; name?: string };
  sprint?: Sprint;
  user?: User;
}

interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

export default function Tareas() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskTimeEstimate, setNewTaskTimeEstimate] = useState<number>(0);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [hoursToComplete, setHoursToComplete] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksData, usersData] = await Promise.all([
        HttpClient.get<Task[]>("/api/tasks", { auth: true }),
        HttpClient.get<User[]>("/api/user", { auth: true }),
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (err: any) {
      const e = err as HttpError;
      setSubmitStatus({
        type: "error",
        message: `Error al cargar datos: ${e.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------- Agregar tarea ----------------------
  const addTask = async () => {
    if (!selectedUserId) {
      setSubmitStatus({
        type: "error",
        message: "Debe seleccionar un usuario para la tarea.",
      });
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    try {
      const newTask = await HttpClient.post<Task>(
        "/api/tasks",
        {
          name: newTaskName,
          description: newTaskDescription,
          timeEstimate: newTaskTimeEstimate,
          status: "TODO",
          user: { id: selectedUserId },
        },
        { auth: true }
      );
      setTasks((prev) => [...prev, newTask]);
      setSubmitStatus({
        type: "success",
        message: `Tarea '${newTask.name}' agregada correctamente.`,
      });
      setIsAddModalOpen(false);
      setNewTaskName("");
      setNewTaskDescription("");
      setNewTaskTimeEstimate(0);
      setSelectedUserId("");
    } catch (err: any) {
      const e = err as HttpError;
      if (e.status === 401) {
        setSubmitStatus({
          type: "error",
          message: "Su sesión ha expirado. Por favor inicie sesión nuevamente.",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: `Error al agregar tarea: ${e.message}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------- Actualizar tarea ----------------------
  const updateTask = async (
    taskId: string,
    updates: Partial<Task>,
    successMessage: string
  ) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    try {
      const updatedTask = await HttpClient.put<Task>(
        `/api/tasks/${taskId}`,
        updates,
        { auth: true }
      );
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      setSubmitStatus({ type: "success", message: successMessage });
    } catch (err: any) {
      const e = err as HttpError;
      if (e.status === 401) {
        setSubmitStatus({
          type: "error",
          message: "Su sesión ha expirado. Por favor inicie sesión nuevamente.",
        });
        return;
      }
      setSubmitStatus({ type: "error", message: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------- Completar tarea ----------------------
  const completeTask = (task: Task) => {
    const hours = hoursToComplete[task.id] ?? 0;
    if (!hours) {
      setSubmitStatus({
        type: "error",
        message: "Debe indicar las horas reales para completar la tarea.",
      });
      return;
    }
    updateTask(
      task.id,
      {
        name: task.name,
        description: task.description,
        timeEstimate: task.timeEstimate,
        user: task.user,
        sprint: task.sprint,
        status: "DONE",
        actualHours: hours,
        deliveryDate: new Date().toISOString(),
      },
      `Tarea '${task.name}' completada con ${hours} horas.`
    );
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-text-secondary">
        Cargando tareas...
      </div>
    );

  return (
    <section className="min-h-screen p-8 bg-background-default">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Tareas</h1>

      {submitStatus.type && (
        <Alert type={submitStatus.type} message={submitStatus.message} />
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          disabled={isSubmitting}
        >
          Agregar Tarea
        </Button>
      </div>

      <ul className="divide-y divide-gray-700">
        {tasks.map((task) => (
          <li key={task.id} className="py-4 flex justify-between items-center">
            <div>
              <div className="font-semibold text-text-primary">{task.name}</div>
              <div className="text-sm text-text-secondary mt-1">
                Status:{" "}
                <span className={`font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                {task.sprint && <span> | Sprint: {task.sprint.name}</span>}
                {task.user && <span> | Usuario: {task.user.name}</span>}
                {task.timeEstimate && (
                  <span> | Estimación: {task.timeEstimate}h</span>
                )}
                {task.actualHours && (
                  <span> | Horas reales: {task.actualHours}h</span>
                )}
              </div>
            </div>
            {task.status !== "DONE" && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  label="Horas invertidas"
                  placeholder="Horas reales"
                  value={hoursToComplete[task.id] ?? ""}
                  onChange={(e) =>
                    setHoursToComplete({
                      ...hoursToComplete,
                      [task.id]: Number(e.target.value),
                    })
                  }
                  className="w-24 p-1 border rounded"
                />
                <Button
                  variant="secondary"
                  onClick={() => completeTask(task)}
                  disabled={isSubmitting}
                >
                  <Check />
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Modal para agregar tarea */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Agregar Nueva Tarea"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={addTask}
              loading={isSubmitting}
              disabled={isSubmitting || !newTaskName}
            >
              Guardar
            </Button>
          </>
        }
      >
        <Input
          label="Nombre de la tarea"
          name="name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          required
        />
        <Textarea
          label="Descripción"
          name="description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          rows={3}
        />
        <Input
          label="Estimación de tiempo (horas)"
          type="number"
          name="timeEstimate"
          value={newTaskTimeEstimate}
          onChange={(e) => setNewTaskTimeEstimate(Number(e.target.value))}
        />
        <div className="mt-4">
          <label className="block mb-1 font-medium text-text-primary">
            Asignar a usuario
          </label>
          <select
            className="w-full p-2 border rounded border-gray-300"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Seleccione un usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </section>
  );
}

function getStatusColor(status: Task["status"]) {
  switch (status) {
    case "DONE":
      return "text-green-400";
    case "IN_PROGRESS":
      return "text-blue-400";
    case "TODO":
      return "text-yellow-400";
    case "TESTING":
      return "text-purple-400";
    default:
      return "text-gray-400";
  }
}
