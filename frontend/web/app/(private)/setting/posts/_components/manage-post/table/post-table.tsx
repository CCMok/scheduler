'use client'

import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider"
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { columns } from "./post-table-column";
import { useEffect, useState } from "react";
import { TABLE_DEFAULT_PAGE_SIZE } from "@/libs/client/_general/constants/table-constant";
import CustomTable from "@/components/table/custom-table";

export default function PostTable() {
  const posts = usePostSettingStore(state => state.posts);
  const postNameFilter = usePostSettingStore(state => state.postNameFilter);

  const [sorting, setSorting] = useState<SortingState>([{
    id: 'name',
    desc: false,
  }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: TABLE_DEFAULT_PAGE_SIZE,
      },
    },
  });

  useEffect(() => {
    table.getColumn('name')?.setFilterValue(postNameFilter);
  }, [postNameFilter, table])

  return (
    <CustomTable table={table} />
  )
}