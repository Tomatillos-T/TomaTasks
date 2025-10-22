import { TableRow } from "../Table/TableRow";
import { TableCell } from "../Table/TableCell";
import { ResponseStatus } from "../../models/responseStatus";

interface DataTableStatusProps {
  status: ResponseStatus;
  span: number;
}

export default function DataTableStatus({ status, span }: DataTableStatusProps) {
  const getMessage = (): string => {
    switch (status) {
      case ResponseStatus.PENDING:
        return "Loading...";
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
