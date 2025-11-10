import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Badge from '../components/Badge';

interface Team {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  members: number;
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Equipo Frontend',
    description: 'Equipo dedicado al desarrollo de interfaces de usuario',
    status: 'active',
    createdAt: '2025-11-01T10:00:00',
    updatedAt: '2025-11-10T15:30:00',
    members: 5
  },
  {
    id: '2',
    name: 'Equipo Backend',
    description: 'Equipo enfocado en el desarrollo de APIs y servicios',
    status: 'active',
    createdAt: '2025-11-02T09:00:00',
    updatedAt: '2025-11-09T14:20:00',
    members: 4
  },
  {
    id: '3',
    name: 'Equipo QA',
    description: 'Equipo de aseguramiento de calidad',
    status: 'inactive',
    createdAt: '2025-11-03T11:00:00',
    updatedAt: '2025-11-08T16:45:00',
    members: 3
  }
];

export default function Equipos() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateTeam = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTeam: Team = {
      id: Math.random().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: 0
    };
    setTeams([...teams, newTeam]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Equipos</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
        >
          <Plus className="w-4 h-4" />
          Crear Equipo
        </Button>
      </div>


      {/* Teams Grid */}
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
              <Badge variant={team.status === 'active' ? 'success' : 'error'}>
                {team.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
              <span className="text-sm text-text-secondary">
                {team.members} miembros
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
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
            <Button type="submit">
              Crear Equipo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
