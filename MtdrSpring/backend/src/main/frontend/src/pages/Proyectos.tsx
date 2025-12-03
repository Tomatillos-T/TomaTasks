// projects/components/Proyectos.tsx
import { useState, useEffect } from "react";
import { Plus, Calendar, DollarSign, Clock, Search, Filter, MoreVertical, CheckCircle, AlertCircle, Circle } from "lucide-react";
// Theme-aware status colors using CSS variables
import Button from "../components/Button";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import StatCard from "../components/StatCard";
import ProjectForm from "../modules/projects/components/ProjectForm";
import type { Project } from "../modules/projects/services/projectService";
import { getProjects } from "../modules/projects/services/projectService";

export default function Proyectos() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  // Cargar proyectos desde el backend
  const fetchProjects = async () => {
    try {
      const data = await getProjects(); 
      setProjects(data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

  useEffect(() => {
    fetchProjects()
  }, [])

  // Theme-aware status mapping using CSS variables
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, any> = {
      "planning": { label: "Planificación", color: "bg-pending-main", textColor: "text-pending-dark", bgColor: "bg-pending-bg", icon: Circle },
      "in-progress": { label: "En Progreso", color: "bg-inProgress-main", textColor: "text-inProgress-dark", bgColor: "bg-inProgress-bg", icon: Clock },
      "completed": { label: "Completado", color: "bg-done-main", textColor: "text-done-dark", bgColor: "bg-done-bg", icon: CheckCircle },
      "on-hold": { label: "En Pausa", color: "bg-todo-main", textColor: "text-todo-dark", bgColor: "bg-todo-bg", icon: AlertCircle }
    }
    return statusMap[status] || statusMap["planning"]
  }

  // Theme-aware priority border colors
  const getPriorityColor = (priority?: string) => {
    const colors: Record<string, string> = {
      "critical": "border-error-main",
      "high": "border-warning-main",
      "medium": "border-inProgress-main",
      "low": "border-info-main"
    }
    return priority ? colors[priority] || colors["medium"] : colors["medium"]
  }

  // Estadísticas
  const totalBudget = projects.reduce((sum, p) => sum + parseFloat((p as any).budget?.replace(/[$,]/g, '') || "0"), 0)
  const totalSpent = projects.reduce((sum, p) => sum + parseFloat((p as any).spent?.replace(/[$,]/g, '') || "0"), 0)
  const activeProjects = projects.filter(p => p.status === "in-progress").length
  const completedProjects = projects.filter(p => p.status === "completed").length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-0">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Gestión de Proyectos</h2>
          <p className="text-text-secondary">Administra y da seguimiento a todos tus proyectos</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* Alert */}
      <div className="mb-6">
        <Alert 
          type="info" 
          message="Tienes proyectos que requieren atención. Asigna recursos según prioridad." 
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Proyectos Activos" value={activeProjects.toString()} change={15.2} icon={Clock} status="info" />
        <StatCard title="Completados" value={completedProjects.toString()} change={8.5} icon={CheckCircle} status="success" />
        <StatCard title="Presupuesto Total" value={`$${(totalBudget / 1000).toFixed(0)}K`} change={12.3} icon={DollarSign} status="success" />
        <StatCard title="Gasto Acumulado" value={`$${(totalSpent / 1000).toFixed(0)}K`} change={-5.2} icon={DollarSign} status="warning" />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => {
          const statusInfo = getStatusInfo(project.status || "")
          const StatusIcon = statusInfo.icon

          return (
            <div
              key={project.id}
              className={`bg-surface border-l-4 ${getPriorityColor((project as any).priority)} border-t border-r border-b border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-1">{project.name}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-medium`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </div>
                </div>
                <button className="text-text-secondary hover:text-text-primary transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-text-secondary text-sm mb-4 line-clamp-2">{project.description}</p>

              {/* Dates */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Calendar className="w-4 h-4 text-text-secondary" />
                <span className="text-xs text-text-secondary">
                {project.startDate && new Date(project.startDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })} - 
                {project.deliveryDate && new Date(project.deliveryDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-text-secondary mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No se encontraron proyectos</p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Proyecto"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          </>
        }
      >
        <ProjectForm />
      </Modal>
    </div>
  )
}
