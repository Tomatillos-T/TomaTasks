import { FileText, Package, TrendingUp, Users } from "lucide-react";
import Alert from "../components/Alert"; 
import StatCard from "../components/StatCard";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useState } from "react";

export default function TomaTaskMockUp() {

  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-0">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Dashboard General</h2>
          <p className="text-text-secondary">Resumen de actividades y métricas clave</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Exportar</Button>
          <Button variant="primary">Nueva Tarea</Button>
        </div>
      </div>
      {/* Alerts */}
      <div className="grid gap-3 mb-6">
        <Alert type="success" message="¡Excelente! Has completado todas las tareas prioritarias de hoy." />
        <Alert type="warning" message="Atención: 5 productos están por debajo del stock mínimo." />
        <Alert type="error" message="Error: No se pudo sincronizar con el sistema de facturación." />
        <Alert type="info" message="Recordatorio: Reunión de equipo programada para las 3:00 PM." />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ventas del Mes" value="$45,231" change={12.5} icon={TrendingUp} status="success" />
        <StatCard title="Tareas Activas" value="127" change={-3.2} icon={FileText} status="warning" />
        <StatCard title="Clientes Nuevos" value="34" change={8.1} icon={Users} status="info" />
        <StatCard title="Productos en Stock" value="1,284" change={-15.3} icon={Package} status="error" />
      </div>


      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Modal</Button>

        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Project Details"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary">Save</Button>
            </>
          }
        >
          <p className="text-text-secondary">Here you can edit the project details.</p>
        </Modal>
      </div>

    </div>
  );
}
