// hooks/useTeam.ts
import { useQuery } from "@tanstack/react-query";
import { getTeamById, getTeamMembers } from "@/modules/teams/services/teamService";
import { getProjects } from "@/modules/teams/services/projectService";
import type { Team, TeamMember } from "@/modules/teams/services/teamService";
import type { Project } from "@/modules/teams/services/projectService";

export default function useTeam(teamId: string) {
  // Fetch team details
  const {
    data: team,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
    error: teamError,
  } = useQuery<Team>({
    queryKey: ["team", teamId],
    queryFn: () => getTeamById(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch team members (alternativa si members no viene en team)
  const {
    data: members,
    isLoading: isLoadingMembers,
  } = useQuery<TeamMember[]>({
    queryKey: ["team", teamId, "members"],
    queryFn: () => getTeamMembers(teamId),
    enabled: !!teamId && !team?.members, // Solo fetch si team no tiene members
    staleTime: 5 * 60 * 1000,
  });

  // Fetch project if team has projectId
  const {
    data: project,
    isLoading: isLoadingProject,
  } = useQuery<Project>({
    queryKey: ["project", team?.projectId],
    queryFn: async () => {
      const projects = await getProjects();
      const found = projects.find(p => p.id === team?.projectId);
      if (!found) throw new Error("Project not found");
      return found;
    },
    enabled: !!team?.projectId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    team,
    members: team?.members || members || [],
    project,
    isLoading: isLoadingTeam || isLoadingMembers || isLoadingProject,
    isError: isErrorTeam,
    error: teamError,
  };
}