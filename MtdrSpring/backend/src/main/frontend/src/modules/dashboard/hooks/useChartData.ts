import { useQuery } from "@tanstack/react-query";
import getTotalHoursBySprintAdapter from "@/modules/dashboard/adapters/getTotalHoursBySprintAdapter";
import getHoursByDeveloperSprintAdapter from "@/modules/dashboard/adapters/getHoursByDeveloperSprintAdapter";
import getTasksByDeveloperSprintAdapter from "@/modules/dashboard/adapters/getTasksByDeveloperSprintAdapter";
import getLastSprintTasksReportAdapter from "@/modules/dashboard/adapters/getLastSprintTasksReportAdapter";

/**
 * Hook for fetching total hours by sprint (Gráfica 1)
 */
export function useTotalHoursBySprint() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["charts", "total-hours-by-sprint"],
    queryFn: getTotalHoursBySprintAdapter,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Hook for fetching hours by developer per sprint (Gráfica 2)
 */
export function useHoursByDeveloperSprint() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["charts", "hours-by-developer-sprint"],
    queryFn: getHoursByDeveloperSprintAdapter,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Hook for fetching tasks completed by developer per sprint (Gráfica 3)
 */
export function useTasksByDeveloperSprint() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["charts", "tasks-by-developer-sprint"],
    queryFn: getTasksByDeveloperSprintAdapter,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Hook for fetching last sprint tasks report (Table)
 */
export function useLastSprintTasksReport() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["charts", "last-sprint-tasks-report"],
    queryFn: getLastSprintTasksReportAdapter,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
