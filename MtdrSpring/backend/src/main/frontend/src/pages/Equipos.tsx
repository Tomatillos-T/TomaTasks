import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Badge from "../components/Badge";
import { 
  getTeams, 
  createTeam, 
  updateTeam, 
  deleteTeam 
} from "../modules/teams/services/teamService";
import type { Team, CreateTeamPayload } from "../modules/teams/services/teamService";
import { TeamStatusLabel, TeamStatusBadge, TeamStatusEnum } from "../modules/teams/services/teamService";

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
    } catch (error: any) {
      console.error("Error al cargar equipos:", error);
      setError(error.message || "Error al cargar los equipos");
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
      setError(null);
      await createTeam(payload);
      setIsCreateModalOpen(false);
      await fetchTeams();
      // Reset form
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error("Error al crear el equipo:", error);
      setError(error.message || "Error al crear el equipo");
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
      setError(null);
      await updateTeam(selectedTeam.id, payload);
      setIsEditModalOpen(false);
      setSelectedTeam(null);
      await fetchTeams();
    } catch (error: any) {
      console.error("Error al actualizar el equipo:", error);
      setError(error.message || "Error al actualizar el equipo");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;

    try {
      setSubmitting(true);
      setError(null);
      await deleteTeam(selectedTeam.id);
      setIsDeleteModalOpen(false);
      setSelectedTeam(null);
      await fetchTeams();
    } catch (error: any) {
      console.error("Error al eliminar el equipo:", error);
      setError(error.message || "Error al eliminar el equipo");
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Equipos</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} variant="primary">
          <Plus className="w-4 h-4" />
          Crear Equipo
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-light border border-error-main text-error-main px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-text-secondary">Cargando equipos...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && teams.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg mb-4">No hay equipos disponibles</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Crear Equipo
          </Button>
        </div>
      )}

      {/* Teams Grid */}
      {!loading && teams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <div
              key={team.id}
              className="bg-background-paper p-6 rounded-xl border border-background-contrast shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3
                  className="font-semibold text-lg text-text-primary cursor-pointer hover:text-primary-main"
                  onClick={() => navigate(`/equipos/${team.id}`)}
                >
                  {team.name}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(team);
                    }}
                    className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-text-secondary" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(team);
                    }}
                    className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-error-main" />
                  </button>
                </div>
              </div>

              <p className="text-text-secondary mb-4 line-clamp-2">{team.description}</p>

              <div className="flex justify-between items-center">
                <Badge variant={TeamStatusBadge[team.status]}>
                  {TeamStatusLabel[team.status]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        title="Crear Nuevo Equipo"
      >
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <Input
            label="Nombre del Equipo"
            name="name"
            required
            placeholder="Ingrese el nombre del equipo"
          />

          <TextArea
            label="Descripción"
            name="description"
            placeholder="Describa el propósito del equipo"
            rows={4}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              name="status"
              required
              className="w-full border rounded px-3 py-2"
              defaultValue={TeamStatusEnum.ACTIVO}
            >
              {Object.values(TeamStatusEnum).map((status) => (
                <option key={status} value={status}>
                  {TeamStatusLabel[status]}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-error-main text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeModals}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creando..." : "Crear Equipo"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="Editar Equipo"
      >
        {selectedTeam && (
          <form onSubmit={handleUpdateTeam} className="space-y-4">
            <Input
              label="Nombre del Equipo"
              name="name"
              required
              defaultValue={selectedTeam.name}
              placeholder="Ingrese el nombre del equipo"
            />

            <TextArea
              label="Descripción"
              name="description"
              defaultValue={selectedTeam.description}
              placeholder="Describa el propósito del equipo"
              rows={4}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="status"
                required
                className="w-full border rounded px-3 py-2"
                defaultValue={selectedTeam.status}
              >
                {Object.values(TeamStatusEnum).map((status) => (
                  <option key={status} value={status}>
                    {TeamStatusLabel[status]}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="text-error-main text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeModals}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        title="Eliminar Equipo"
      >
        {selectedTeam && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              ¿Estás seguro de que deseas eliminar el equipo{" "}
              <span className="font-semibold text-text-primary">
                {selectedTeam.name}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            {error && (
              <div className="text-error-main text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeModals}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleDeleteTeam}
                disabled={submitting}
                className="bg-error-main hover:bg-error-dark"
              >
                {submitting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}