import React from "react";
import type Task from "@/modules/task/models/task";
import type { TaskTableMeta } from "@/modules/task/models/taskTableMeta";
import Button from "@/components/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/DropdownMenu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/AlertDialog";
import { Ellipsis } from "lucide-react";

export const ColumnDropDownMenu: React.FC<{
  task: Task;
  meta: TaskTableMeta;
}> = ({ task, meta }) => {
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = () => {
    setOpen(false);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (isDeleting) return;
    setDialogOpen(false);
    setIsDeleting(true);

    try {
      await meta.removeRow(task.id);
    } catch {
      setErrorDialogOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 border border-primary-foreground cursor-pointer"
          >
            <Ellipsis
              size={16}
              style={{ width: "16px", height: "16px", minWidth: "16px" }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem className="p-0">
            <a
              className="w-full h-full px-2 py-1.5 block"
              href={`/task/${task.id}`}
            >
              Detalles
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <a
              className="w-full h-full px-2 py-1.5 block"
              href={`/task/${task.id}/edit`}
            >
              Editar
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleDelete} className="text-red-600">
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de eliminar la Tarea?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={confirmDelete}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
            <AlertDialogCancel onClick={cancelDelete}>
              Cancelar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-error-main">
              Error al eliminar
            </AlertDialogTitle>
            <AlertDialogDescription>
              No se pudo eliminar la tarea. Por favor, intenta de nuevo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
              Cerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
