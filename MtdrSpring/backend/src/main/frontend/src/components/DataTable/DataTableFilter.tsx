import React from "react";
import { Badge } from "../Badge";
import Button from "../Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../Command";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Separator } from "../Separator";
import clsx from "clsx";
import type { FilterValue } from "./types";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableFacetedFilterProps {
  title: string;
  facets?: Map<string, number>;
  options: FilterOption[];
  selectedValues: Set<string>;
  setFilterValue: (value: FilterValue) => void;
  search?: string;
  setSearch?: (search: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
}

export function DataTableFacetedFilter({
  title,
  facets,
  options,
  selectedValues,
  setFilterValue,
  search,
  setSearch,
  isLoading,
}: DataTableFacetedFilterProps) {
  const backendFiltered = search !== undefined && setSearch !== undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed border-background-contrast"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} seleccionados
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command shouldFilter={!backendFiltered}>
          <CommandInput
            placeholder={title}
            value={search}
            onChangeCapture={(e: React.FormEvent<HTMLInputElement>) => {
              const value = (e.target as HTMLInputElement).value;
              if (setSearch) {
                setSearch(value);
              }
            }}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "...Cargando" : "No hay opciones disponibles"}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={clsx(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-background-contrast",
                        isSelected
                          ? "bg-primary-main text-primary-contrast"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-text-secondary" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Limpiar
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
