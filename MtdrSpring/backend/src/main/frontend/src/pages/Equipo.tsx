import { useState } from 'react';
import { Users, FolderKanban, MoreHorizontal } from 'lucide-react';
import Tabs from '../components/Tabs';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { ResponseStatus } from "@/models/responseStatus";
import { DataTableAdvanced } from '@/components/DataTable/DataTableAdvanced';
import type { FilterData } from '@/components/DataTable/types';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ROLE_DEVELOPER' | 'ROLE_ADMIN';
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface DetailedTeam {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  project?: Project;
}

const mockTeamData: DetailedTeam = {
  id: '1',
  name: 'Equipo Frontend',
  description: 'Equipo dedicado al desarrollo de interfaces de usuario',
  status: 'active',
  createdAt: '2025-11-01T10:00:00',
  updatedAt: '2025-11-10T15:30:00',
  members: [
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      role: 'ROLE_DEVELOPER',
    },
    {
      id: '2',
      firstName: 'María',
      lastName: 'García',
      email: 'maria@example.com',
      role: 'ROLE_ADMIN',
    },
  ],
  project: {
    id: '1',
    name: 'Rediseño Dashboard',
    description: 'Actualización completa del dashboard principal',
    status: 'in-progress',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
  },
};

export default function Equipo() {
  const [activeTab, setActiveTab] = useState('resumen');
  const [team] = useState<DetailedTeam>(mockTeamData);

  // Búsqueda para la tabla de miembros
  const [memberSearchInput, setMemberSearchInput] = useState('');

  const memberColumns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'firstName',
      header: 'Nombre',
      cell: ({ row }) => {
        const firstName = row.getValue('firstName') as string;
        const lastName = row.getValue('lastName') as string;
        return (
          <div>
            <div className="font-medium">{`${firstName} ${lastName}`}</div>
            <div className="text-sm text-text-secondary">{row.original.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'lastName',
      header: 'Apellido',
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableHiding: true,
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant={role === 'ROLE_ADMIN' ? 'error' : 'secondary'}>
            {role === 'ROLE_ADMIN' ? 'Admin' : 'Developer'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => console.log('Editar rol', row.original)}
              >
                Cambiar rol
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => console.log('Remover miembro', row.original)}
              >
                Remover del equipo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const memberTable = useReactTable({
    data: team.members,
    columns: memberColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: memberSearchInput,
    },
    onGlobalFilterChange: setMemberSearchInput,
  });

  const memberFilters: FilterData[] = [
    {
      column: 'role',
      title: 'Rol',
      data: [
        { label: 'Admin', value: 'ROLE_ADMIN' },
        { label: 'Developer', value: 'ROLE_DEVELOPER' },
      ],
    },
  ];

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'miembros', label: 'Miembros' },
    { id: 'proyecto', label: 'Proyecto' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-text-primary mb-2 pb-4 border-b border-background-contrast">
                  Información General
                </h3>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Nombre</p>
                  <p className="font-medium text-text-primary">{team.name}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Descripción</p>
                  <p className="font-medium text-text-primary">
                    {team.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Estado</p>
                  <Badge variant={team.status === 'active' ? 'success' : 'error'}>
                    {team.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-text-primary mb-2 pb-4 border-b border-background-contrast">
                  Detalles
                </h3>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Miembros</p>
                  <p className="font-medium text-text-primary">
                    {team.members.length} miembros
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Creado</p>
                  <p className="font-medium text-text-primary">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Última actualización</p>
                  <p className="font-medium text-text-primary">
                    {new Date(team.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'miembros':
        return (
          <div className="h-[calc(100vh-280px)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Miembros del Equipo
              </h2>
              <Button>
                <Users className="w-4 h-4" />
                Agregar Miembro
              </Button>
            </div>
            <DataTableAdvanced
              columns={memberColumns}
              table={memberTable}
              status={ResponseStatus.SUCCESS}
              searchInput={memberSearchInput}
              setSearchInput={setMemberSearchInput}
              filters={memberFilters}
              isRefetching={false}
            />
          </div>
        );

      case 'proyecto':
        return (
          <div className="space-y-6">
            {team.project ? (
              <div className="bg-background-paper p-6 rounded-lg border border-background-contrast">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                      {team.project.name}
                    </h3>
                    <p className="text-text-secondary mt-1">
                      {team.project.description}
                    </p>
                  </div>
                  <Badge variant="inprogress">En Progreso</Badge>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">
                      Fecha de inicio
                    </p>
                    <p className="font-medium text-text-primary">
                      {new Date(team.project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">
                      Fecha de finalización
                    </p>
                    <p className="font-medium text-text-primary">
                      {new Date(team.project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="secondary">Ver detalles del proyecto</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderKanban className="mx-auto h-12 w-12 text-text-secondary" />
                <h3 className="mt-2 text-sm font-medium text-text-primary">
                  Sin proyecto asignado
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Este equipo no tiene un proyecto asignado actualmente.
                </p>
                <div className="mt-6">
                  <Button>Asignar Proyecto</Button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="pb-4 border-b border-background-contrast">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {team.name}
        </h1>
        <p className="text-text-secondary">{team.description}</p>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="py-6">{renderTabContent()}</div>
    </div>
  );
}
