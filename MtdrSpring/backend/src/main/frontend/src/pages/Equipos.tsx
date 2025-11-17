import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/Tooltip";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  type Team,
  type CreateTeamPayload,
  TeamStatusLabel,
  TeamStatusBadge,
  TeamStatusEnum,
} from "@/modules/teams/services/teamService";
import TeamForm from "@/modules/teams/components/teamForm";
import TeamDeleteModal from "@/modules/teams/components/teamDeleteModal";

export default function Equipos() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
      setError(error instanceof Error ? error.message : "Error al cargar los equipos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: CreateTeamPayload = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
      status: formData.get("status") as TeamStatusEnum,
    };

    try {
      setSubmitting(true);
      await createTeam(payload);
      setIsCreateModalOpen(false);
      await fetchTeams();
    } catch (error) {
      console.error("Error al crear el equipo:", error);
      setError(error instanceof Error ? error.message : "Error al crear el equipo");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTeam = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTeam) return;
    const formData = new FormData(event.currentTarget);
    const payload: Partial<CreateTeamPayload> = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
      status: formData.get("status") as TeamStatusEnum,
    };

    try {
      setSubmitting(true);
      await updateTeam(selectedTeam.id, payload);
      setIsEditModalOpen(false);
      setSelectedTeam(null);
      await fetchTeams();
    } catch (error) {
      console.error("Error al actualizar el equipo:", error);
      setError(error instanceof Error ? error.message : "Error al actualizar el equipo");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;
    try {
      setSubmitting(true);
      await deleteTeam(selectedTeam.id);
      setIsDeleteModalOpen(false);
      setSelectedTeam(null);
      await fetchTeams();
    } catch (error) {
      console.error("Error al eliminar el equipo:", error);
      setError(error instanceof Error ? error.message : "Error al eliminar el equipo");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (team: Team) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
    setError(null);
  };

  const openDeleteModal = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
    setError(null);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedTeam(null);
    setError(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Equipos</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} variant="primary">
          <Plus className="w-4 h-4" />
          Crear Equipo
        </Button>
      </div>

      {error && (
        <div className="bg-error-light border border-error-main text-error-main px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <p className="text-text-secondary">Cargando equipos...</p>
        </div>
      )}

      {!loading && teams.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg mb-4">
            No hay equipos disponibles
          </p>
        </div>
      )}

      {!loading && teams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-background-paper p-6 rounded-xl border border-background-contrast shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/equipos/${team.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-text-primary cursor-pointer hover:text-primary-main">
                  {team.name}
                </h3>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(team);
                        }}
                        className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-text-secondary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Editar equipo</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(team);
                        }}
                        className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-error-main" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Eliminar equipo</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <p className="text-text-secondary mb-4 line-clamp-2">
                {team.description}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant={TeamStatusBadge[team.status]}>
                  {TeamStatusLabel[team.status]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <TeamForm
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateTeam}
        isSubmitting={submitting}
        error={error}
      />

      <TeamForm
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleUpdateTeam}
        isSubmitting={submitting}
        error={error}
        editingTeam={selectedTeam}
      />

      <TeamDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDeleteTeam}
        team={selectedTeam}
        isSubmitting={submitting}
        error={error}
      />
    </div>
  );
}
