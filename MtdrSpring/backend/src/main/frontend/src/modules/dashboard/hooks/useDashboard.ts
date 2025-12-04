import { useQuery } from "@tanstack/react-query";
import getUserDashboardAdapter from "@/modules/dashboard/adapters/getUserDashboardAdapter";

export default function useDashboard(sprintId?: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "user", sprintId],
    queryFn: () => getUserDashboardAdapter(sprintId),
    staleTime: 2 * 60 * 1000, // Los datos se consideran frescos por 2 minutos
    gcTime: 5 * 60 * 1000, // Mantener en caché por 5 minutos
    refetchOnMount: true, // Refetch al montar para obtener datos actualizados
    refetchOnWindowFocus: false, // No refetch al volver a la ventana
  });

  return {
    dashboard: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
