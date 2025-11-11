import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import Input from "@/components/Input";
import Button from "@/components/Button";
import type { Table, ColumnFilter } from "@tanstack/react-table";

interface DataTableViewFormProps<TData = unknown> {
  open: boolean;
  setOpen: (value: boolean) => void;
  table: Table<TData>;
  search: string;
  onSave?: (viewName: string, filters: ColumnFilter[], search: string) => void;
}

export default function DataTableViewForm<TData = unknown>({
  open,
  setOpen,
  table,
  search,
  onSave,
}: DataTableViewFormProps<TData>) {
  const [viewName, setViewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewName.trim()) return;

    setIsLoading(true);
    const filters = table.getState().columnFilters;

    try {
      // Call the onSave callback if provided
      if (onSave) {
        await onSave(viewName, filters, search);
      }

      // Reset form and close
      setViewName("");
      setOpen(false);
    } catch (error) {
      console.error("Error saving view:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-auto max-h-screen max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Agregar vista</DialogTitle>
          <DialogDescription className="text-center">
            Llena el formulario para agregar una nueva vista.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <div>
            <Input
              label="Nombre"
              placeholder="Ejemplo: Tareas activas"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              required
            />
          </div>
          <div className="w-full items-center flex justify-center">
            <Button
              type="submit"
              variant="outline"
              disabled={isLoading || !viewName.trim()}
              className="transition-all duration-200 px-6 py-2"
            >
              {isLoading ? "Agregando..." : "Agregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
