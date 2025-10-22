import { Table } from "../Table/Table";
import { TableBody } from "../Table/TableBody";
import { TableCell } from "../Table/TableCell";
import { TableHead } from "../Table/TableHead";
import { TableHeader } from "../Table/TableHeader";
import { TableRow } from "../Table/TableRow";

export default function DataTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow onClick={() => console.log("clicked")}>
          <TableCell>Juan</TableCell>
          <TableCell>Activo</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
