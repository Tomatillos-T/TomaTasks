import type { ColumnFilter, SortingState } from "@tanstack/react-table";

export default interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  filters?: ColumnFilter[];
  sorting?: SortingState;
}
