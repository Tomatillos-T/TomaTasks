import { TableRow } from "../Table/TableRow";
import { TableCell } from "../Table/TableCell";

type Props = {
  status: string;
  span: number;
};

export default function TableStatus({ status, span }: Props) {
  return (
    <TableRow>
      <TableCell colSpan={span} className="h-24 text-center">
        {status === "Loading"
          ? "Loading..."
          : status === "Error"
          ? "Algo salio mal, intente de nuevo"
          : "No hay datos"}
      </TableCell>
    </TableRow>
  );
}
