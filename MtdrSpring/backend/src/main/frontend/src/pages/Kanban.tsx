import KanbanBoard from "@/modules/task/components/KanbanBoard";

export default function Kanban() {
  return (
    <div className="h-full flex flex-col p-6 min-h-0">
      <KanbanBoard />
    </div>
  );
}
