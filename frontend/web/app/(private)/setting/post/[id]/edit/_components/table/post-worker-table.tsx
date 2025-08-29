'use client'

import { ColumnFiltersState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import CustomTable from "@/components/table/custom-table";
import { getColumns } from "./post-worker-table-column";
import { TABLE_DEFAULT_PAGE_SIZE } from "@/libs/client/_general/constants/table-constant";
import { usePostUpdateStore } from "@/app/(private)/setting/post/[id]/edit/_components/store/post-update-store-provider";

export default function PostWorkerTable() {
  const postId = usePostUpdateStore(state => state.postId)
  const postName = usePostUpdateStore(state => state.postName)
  const workers = usePostUpdateStore(state => state.workers)

  const [sorting, setSorting] = useState<SortingState>([{
    id: 'name',
    desc: false,
  }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = getColumns(postId, postName);

  const table = useReactTable({
    data: workers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
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

  return (
    <CustomTable table={table} />
  )
}