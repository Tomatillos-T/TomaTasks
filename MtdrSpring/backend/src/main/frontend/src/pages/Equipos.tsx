import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Badge from "../components/Badge";
import { getTeams, createTeam } from "../modules/teams/services/teamService";
import type { Team, CreateTeamPayload } from "../modules/teams/services/teamService";

export default function Equipos() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
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
      description: formData.get("description") as string,
      status: "active",
      projectId: "default-project"
    };

    try {
      await createTeam(payload);
      setIsCreateModalOpen(false);
      fetchTeams();
    } catch (error) {
      console.error("Error al crear el equipo:", error);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
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

      {loading && (
        <p className="text-text-secondary">Cargando equipos...</p>
      )}

      {!loading && (
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
                      navigate(`/equipos/${team.id}`);
                    }}
                    className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-text-secondary" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTeam(team.id);
                    }}
                    className="p-2 hover:bg-background-subtle rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-error-main" />
                  </button>
                </div>
              </div>

              <p className="text-text-secondary mb-4 line-clamp-2">{team.description}</p>

              <div className="flex justify-between items-center">
                <Badge variant={team.status === "active" ? "success" : "error"}>
                  {team.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
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

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Equipo</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
