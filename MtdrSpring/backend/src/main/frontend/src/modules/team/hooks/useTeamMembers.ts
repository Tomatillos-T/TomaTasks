import { useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { TeamMember } from "../models/team";
import { columns } from "../components/MembersColumns";

export default function useTeamMembers(initialMembers: TeamMember[]) {
  const [searchInput, setSearchInput] = useState("");

  const table = useReactTable({
    data: initialMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: searchInput,
    },
    onGlobalFilterChange: setSearchInput,
  });

  return {
    table,
    searchInput,
    setSearchInput,
    status: "success" as const,
    isRefetching: false,
  };
}