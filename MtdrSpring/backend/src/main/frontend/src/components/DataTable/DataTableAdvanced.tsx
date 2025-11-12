import React from "react";
import type {
  ColumnDef,
  Table as TanStackTable,
  Row,
  HeaderGroup,
  Header,
  Cell,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Table } from "@/components/Table/Table";
import { TableBody } from "@/components/Table/TableBody";
import { TableCell } from "@/components/Table/TableCell";
import { TableHead } from "@/components/Table/TableHead";
import { TableHeader } from "@/components/Table/TableHeader";
import { TableRow } from "@/components/Table/TableRow";
import DataTableStatus from "@/components/DataTable/DataTableStatus";
import { DataTableToolbar } from "@/components/DataTable/DataTableToolbar";
import { DataTablePagination } from "@/components/DataTable/DataTablePagination";
import type { FilterData } from "@/components/DataTable/types";
import { ResponseStatus } from "@/models/responseStatus";

interface DataTableAdvancedProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: TanStackTable<TData>;
  redirection?: string;
  status: ResponseStatus;
  searchInput: string;
  setSearchInput: (value: string) => void;
  filters: FilterData[];
  onRowClick?: (row: Row<TData>) => void;
  isRefetching?: boolean;
}

export function DataTableAdvanced<TData, TValue>({
  columns,
  table,
  redirection,
  status,
  searchInput,
  setSearchInput,
  filters,
  onRowClick,
  isRefetching = false,
}: DataTableAdvancedProps<TData, TValue>) {
  const handleRowClick = (row: Row<TData>, e: React.MouseEvent) => {
    // Check if click is on an interactive element
    const target = e.target as HTMLElement;
    const isInteractive =
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button") ||
      target.closest("a");

    if (isInteractive) return;

    if (onRowClick) {
      onRowClick(row);
    } else if (redirection) {
      // Default redirection behavior
      const original = row.original as Record<string, unknown>;
      const itemType = original.itemType;
      const id = original.id;

      if (itemType === "variant" || itemType === "material") {
        window.location.href = `${redirection}/${
          itemType === "variant" ? "" : "materials"
        }/${id}`;
      } else {
        window.location.href = `${redirection}/${id}`;
      }
    }
  };

  return (
    <div className="h-full flex flex-col gap-2 min-h-0">
      <div className="h-full flex flex-col border border-background-contrast rounded-md p-2 gap-2 min-h-0">
        <div className="flex-shrink-0">
          <DataTableToolbar
            table={table}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            filters={filters}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-auto rounded-md border border-background-contrast scrollbar-thin">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header: Header<TData, unknown>) => {
                    const sortingHandler = header.column.getToggleSortingHandler();
                    return (
                      <TableHead
                        key={header.id}
                        onClick={
                          header.column.getCanSort() && sortingHandler
                            ? (e: React.MouseEvent<HTMLTableCellElement>) =>
                                sortingHandler(e)
                            : undefined
                        }
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="ml-2">
                                {header.column.getIsSorted() === "asc" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                ) : header.column.getIsSorted() === "desc" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 opacity-50"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                    />
                                  </svg>
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isRefetching ? (
                <DataTableStatus status={ResponseStatus.PENDING} span={columns.length} />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: Row<TData>) => (
                  <TableRow
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    key={row.id}
                    onClick={(e: React.MouseEvent<HTMLTableRowElement>) =>
                      handleRowClick(row, e)
                    }
                    className={redirection || onRowClick ? "cursor-pointer" : ""}
                  >
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <DataTableStatus status={status} span={columns.length} />
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex-shrink-0">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
