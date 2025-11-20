import { useQuery } from "@tanstack/react-query";
import getManagerDashboardAdapter from "@/modules/dashboard/adapters/getManagerDashboardAdapter";

export default function useManagerDashboard(sprintId?: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "manager", sprintId],
    queryFn: () => getManagerDashboardAdapter(sprintId),
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
