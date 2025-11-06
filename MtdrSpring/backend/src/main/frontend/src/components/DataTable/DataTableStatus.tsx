import { TableRow } from "@/components/Table/TableRow";
import { TableCell } from "@/components/Table/TableCell";
import { ResponseStatus } from "@/models/responseStatus";

interface DataTableStatusProps {
  status: ResponseStatus;
  span: number;
}

export default function DataTableStatus({ status, span }: DataTableStatusProps) {
  const getMessage = (): JSX.Element | string => {
    switch (status) {
      case ResponseStatus.PENDING:
        return (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-primary-main"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-text-secondary">Cargando tareas...</span>
          </div>
        );
      case ResponseStatus.ERROR:
        return "Algo salió mal, intente de nuevo";
      case ResponseStatus.EMPTY:
        return "No hay datos";
      case ResponseStatus.SUCCESS:
        return "No hay datos";
      default:
        return "No hay datos";
    }
  };

  return (
    <TableRow>
      <TableCell colSpan={span} className="h-24 text-center">
        {getMessage()}
      </TableCell>
    </TableRow>
  );
}
