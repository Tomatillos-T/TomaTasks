import { useQuery } from "@tanstack/react-query";
import getSprintsAdapter from "@/modules/sprint/adapters/getSprintsAdapter";

export default function useSprints() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sprints"],
    queryFn: getSprintsAdapter,
    staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
    gcTime: 10 * 60 * 1000, // Mantener en caché por 10 minutos
    refetchOnMount: false, // No refetch si hay datos en caché
    refetchOnWindowFocus: false, // No refetch al volver a la ventana
  });

  return {
    sprints: data?.data || [],
    isLoading,
    isError,
    error,
  };
}
