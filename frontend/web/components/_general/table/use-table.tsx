'use client'
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { TABLE_DEFAULT_PAGE_SIZE } from "@/libs/client/_general/constants/table-constant";

type Props<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  defaultSorting: SortingState;
  defaultColumnFilters?: ColumnFiltersState;
  getRowId?: (row: TData) => string;
  hasPagination?: boolean;
}

export default function useTable<TData>({
  data,
  columns,
  defaultSorting,
  defaultColumnFilters,
  getRowId,
  hasPagination = true,
}: Readonly<Props<TData>>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(defaultColumnFilters ?? []);

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: hasPagination ? getPaginationRowModel() : undefined,
    getRowId,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: TABLE_DEFAULT_PAGE_SIZE,
      },
    },
  })
}