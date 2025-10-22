import { useState } from "react";
import type { Table, ColumnFiltersState } from "@tanstack/react-table";
import Button from "../Button";
import Input from "../Input";
import { DataTableFacetedFilter } from "./DataTableFilter";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip";
import type { FilterData, FilterValue } from "./types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchInput: string;
  setSearchInput: (value: string) => void;
  filters: FilterData[];
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function DataTableToolbar<TData>({
  table,
  searchInput,
  setSearchInput,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [filterView, setFilterView] = useState(false);

  return !filterView ? (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <p className="text-sm font-medium text-text-secondary">Vista actual</p>
      </div>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="h-8 px-2"
              onClick={() => setFilterView(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Buscar y filtrar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          className="h-8"
        />
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-4"
          onClick={() => {
            setFilterView(false);
          }}
        >
          Aplicar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-4"
          onClick={() => {
            setFilterView(false);
          }}
        >
          Cancelar
        </Button>
      </div>
      <div className="w-full h-[1px] bg-background-contrast rounded-full"></div>
      <div className="flex gap-2 max-w-full overflow-x-auto">
        {filters.map((filter) => {
          const column = table
            .getAllColumns()
            .find((c) => c.id === filter.column);
          const hasColumn = !!column;
          const options = filter.data.map((data) => ({
            label: capitalize(data.name || data.label || data.value),
            value: data.value,
          }));
          const filterValue = hasColumn
            ? column?.getFilterValue()
            : table.getState().columnFilters.find((f) => f.id === filter.column)
                ?.value;
          const selectedValues = new Set<string>(
            Array.isArray(filterValue) ? filterValue : []
          );

          const setFilterValue = (value: FilterValue): void => {
            if (hasColumn) {
              column?.setFilterValue(value);
            } else {
              table.setColumnFilters(
                (prev: ColumnFiltersState): ColumnFiltersState => {
                  const newFilters = prev.filter((f) => f.id !== filter.column);

                  if (!value) {
                    return newFilters;
                  }

                  return [
                    ...newFilters,
                    {
                      id: filter.column,
                      value,
                    },
                  ];
                }
              );
            }
          };

          return (
            <DataTableFacetedFilter
              key={filter.column}
              title={filter.title}
              facets={hasColumn ? column?.getFacetedUniqueValues() : undefined}
              options={options}
              setFilterValue={setFilterValue}
              selectedValues={selectedValues}
              search={filter.search}
              setSearch={filter.setSearch}
              isLoading={filter.isLoading}
              isFetching={filter.isFetching}
              hasNextPage={filter.hasNextPage}
              fetchNextPage={filter.fetchNextPage}
            />
          );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
