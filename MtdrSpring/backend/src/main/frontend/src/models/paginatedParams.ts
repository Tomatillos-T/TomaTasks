import type { ColumnFilter } from "@tanstack/react-table";

export default interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  filters?: ColumnFilter[];
  sorting?: { id: string; desc: boolean }[];
}
