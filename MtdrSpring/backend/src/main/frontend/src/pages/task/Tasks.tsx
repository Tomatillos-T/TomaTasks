import { ResponseStatus } from "../../models/responseStatus";
import useTasks from "../../modules/task/hooks/useTasks";

export default function Tasks() {
  const { status, data, total, error } = useTasks();

  if (status === ResponseStatus.PENDING) {
    return <div>Loading...</div>;
  }

  if (status === ResponseStatus.ERROR) {
    return <div>Error loading tasks: {error?.message}</div>;
  }
  if (status === ResponseStatus.EMPTY) {
    return <div>No tasks found.</div>;
  }

  return (
    <div>
      <h1>Tasks</h1>
      {error && <div>Error: {error.message}</div>}
      <div>Total Tasks: {total}</div>
      <ul>
        {data.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
}
