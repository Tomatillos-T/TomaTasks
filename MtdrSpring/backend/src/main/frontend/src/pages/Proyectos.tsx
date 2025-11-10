import { useState, useEffect } from "react";
import { Plus, Calendar, DollarSign, Clock, Search, Filter, MoreVertical, CheckCircle, AlertCircle, Circle, Trash2 } from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import StatCard from "../components/StatCard";
import ProjectForm from "../modules/projects/components/ProjectForm";
import type { Project } from "../modules/teams/services/projectService";
import { getProjects } from "../modules/teams/services/projectService";
import { deleteProject } from "../modules/projects/services/projectService";

export default function Proyectos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm] = useState("");
  const [filterStatus] = useState<"all" | string>("all");

  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // 🔹 Charger projets
  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

  // 🔹 Cargar proyectos desde el backend
  const handleProjectCreated = async () => {
    setIsModalOpen(false); // fermer le modal
    await fetchProjects(); // recharger la liste
  };

  // 🔹 Manejar eliminación de proyectos (confirmado desde modal)
  const handleDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      alert("Error al eliminar el proyecto.");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".relative")) setMenuOpenId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, any> = {
      planning: { label: "Planificación", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-100", icon: Circle },
      "in-progress": { label: "En Progreso", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-100", icon: Clock },
      completed: { label: "Completado", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle },
      "on-hold": { label: "En Pausa", color: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-100", icon: AlertCircle },
    };
    return statusMap[status] || statusMap["planning"];
  };

  const getPriorityColor = (priority?: string) => {
    const colors: Record<string, string> = {
      critical: "border-red-500",
      high: "border-orange-500",
      medium: "border-yellow-500",
      low: "border-blue-500",
    };
    return priority ? colors[priority] || colors["medium"] : colors["medium"];
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalBudget = projects.reduce((sum, p) => sum + parseFloat((p as any).budget?.replace(/[$,]/g, "") || "0"), 0);
  const totalSpent = projects.reduce((sum, p) => sum + parseFloat((p as any).spent?.replace(/[$,]/g, "") || "0"), 0);
  const activeProjects = projects.filter((p) => p.status === "in-progress").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;

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
        <Alert type="info" message="Tienes proyectos que requieren atención. Asigna recursos según prioridad." />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Proyectos Activos" value={activeProjects.toString()} change={15.2} icon={Clock} status="info" />
        <StatCard title="Completados" value={completedProjects.toString()} change={8.5} icon={CheckCircle} status="success" />
        <StatCard title="Presupuesto Total" value={`$${(totalBudget / 1000).toFixed(0)}K`} change={12.3} icon={DollarSign} status="success" />
        <StatCard title="Gasto Acumulado" value={`$${(totalSpent / 1000).toFixed(0)}K`} change={-5.2} icon={DollarSign} status="warning" />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const statusInfo = getStatusInfo(project.status || "");
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={project.id}
              className={`bg-surface border-l-4 ${getPriorityColor((project as any).priority)} border-t border-r border-b border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-1">{project.name}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-medium`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </div>
                </div>
                {/* Menu trois points + menu contextuel */}
                <div className="relative" data-project-menu>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === project.id ? null : project.id);
                    }}
                    className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-full"
                    title="ver opciones"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {menuOpenId === project.id && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <button
                        onClick={() => {
                          setProjectToDelete(project);
                          setDeleteModalOpen(true);
                          setMenuOpenId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded-md"
                      >
                        Eliminar
                      </button>
                      {/* aquí se pueden agregar opciones */}
                    </div>
                  )}
                </div>

              </div>

              <p className="text-text-secondary text-sm mb-4 line-clamp-2">{project.description}</p>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Calendar className="w-4 h-4 text-text-secondary" />
                <span className="text-xs text-text-secondary">
                  {project.startDate && new Date(project.startDate).toLocaleDateString("es-MX", { month: "short", day: "numeric" })} -
                  {project.deliveryDate && new Date(project.deliveryDate).toLocaleDateString("es-MX", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
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
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
        }
      >
        {/* ✅ Passe la callback ici */}
        <ProjectForm onProjectCreated={handleProjectCreated} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar eliminación"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Regresar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3">
          <Trash2 className="w-6 h-6 text-red-500" />
          <p className="text-text-secondary">
            ¿Seguro que deseas eliminar el proyecto{" "}
            <span className="font-semibold text-text-primary">{projectToDelete?.name}</span>?  
            Esta acción no se puede deshacer.
          </p>
        </div>
      </Modal>
    </div>
  );
}
