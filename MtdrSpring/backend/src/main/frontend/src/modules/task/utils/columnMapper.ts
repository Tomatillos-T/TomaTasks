/**
 * Column Mapping Orchestration
 *
 * Single Responsibility: This module orchestrates column and filter transformations
 * Dependency Inversion: Depends on abstractions (config and mappers) not concrete implementations
 *
 * This module provides the public API for transforming frontend table data
 * to backend-compatible format
 */

import type { ColumnFilter, SortingState } from "@tanstack/react-table";
import { COLUMN_MAPPING } from "@/modules/task/utils/columnMappingConfig";
import { getValueMapper } from "@/modules/task/utils/filterValueMappers";

/**
 * Maps a single frontend column name to backend property name
 *
 * @param column - Frontend column identifier
 * @returns Backend property name
 */
export function mapColumnToBackend(column: string): string {
  return COLUMN_MAPPING[column] || column;
}

/**
 * Maps filter values for specific columns using registered value mappers
 *
 * Single Responsibility: Only handles the logic of applying the correct mapper
 * Open/Closed: New mappers can be added without modifying this function
 *
 * @param columnId - The column identifier
 * @param value - The filter value to transform
 * @returns Transformed value for backend consumption
 */
function mapFilterValue(columnId: string, value: unknown): unknown {
  const mapper = getValueMapper(columnId);
  return mapper(value);
}

/**
 * Maps frontend column filters to backend format
 *
 * Transforms both column IDs and their values according to backend requirements
 *
 * @param filters - Array of frontend column filters
 * @returns Transformed filters for backend, or undefined if no filters provided
 */
export function mapFiltersToBackend(
  filters?: ColumnFilter[]
): ColumnFilter[] | undefined {
  if (!filters) return undefined;

  return filters.map((filter) => ({
    ...filter,
    id: mapColumnToBackend(filter.id),
    value: mapFilterValue(filter.id, filter.value),
  }));
}

/**
 * Maps frontend sorting state to backend format
 *
 * Transforms column IDs in sort configuration to backend property names
 *
 * @param sorting - Frontend sorting state
 * @returns Transformed sorting state for backend, or undefined if no sorting provided
 */
export function mapSortingToBackend(
  sorting?: SortingState
): SortingState | undefined {
  if (!sorting) return undefined;

  return sorting.map((sort) => ({
    ...sort,
    id: mapColumnToBackend(sort.id),
  }));
}
