export interface FilterOptionData {
  name?: string;
  label?: string;
  value: string;
}

export interface FilterData {
  column: string;
  title: string;
  data: FilterOptionData[];
  search?: string;
  setSearch?: (search: string) => void;
}

export type FilterValue = string[] | undefined;
