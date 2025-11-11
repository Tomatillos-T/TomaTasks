import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, FolderKanban, MoreHorizontal, Loader2 } from 'lucide-react';
import Tabs from '../components/Tabs';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { ResponseStatus } from "@/models/responseStatus";
import { DataTableAdvanced } from '@/components/DataTable/DataTableAdvanced';
import type { FilterData } from '@/components/DataTable/types';
import useTeam from '@/modules/team/hooks/useTeam';
import type { TeamMember } from '@/modules/teams/services/teamService';
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

export default function Equipo() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('resumen');
  const [memberSearchInput, setMemberSearchInput] = useState('');

  const { team, members, project, isLoading, isError } = useTeam(id || '');

  const memberColumns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'firstName',
      header: 'Nombre',
      cell: ({ row }) => {
        const firstName = row.getValue('firstName') as string;
        const lastName = row.original.lastName;
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
    data: members,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !team) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Error</h2>
          <p className="text-text-secondary">No se pudo cargar el equipo</p>
        </div>
      </div>
    );
  }

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
                  <Badge variant={team.status === 'ACTIVO' ? 'success' : 'error'}>
                    {team.status}
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
                    {members.length} miembros
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
            {project ? (
              <div className="bg-background-paper p-6 rounded-lg border border-background-contrast">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                      {project.name}
                    </h3>
                    <p className="text-text-secondary mt-1">
                      {project.description}
                    </p>
                  </div>
                  <Badge variant="inprogress">{project.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">
                      Fecha de inicio
                    </p>
                    <p className="font-medium text-text-primary">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">
                      Fecha de finalización
                    </p>
                    <p className="font-medium text-text-primary">
                      {project.deliveryDate ? new Date(project.deliveryDate).toLocaleDateString() : 'N/A'}
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