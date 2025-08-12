'use client'

import { ColumnFiltersState, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import CustomTable from "@/components/table/custom-table";
import { getColumns } from "./worker-post-table-column";
import { TABLE_DEFAULT_PAGE_SIZE } from "@/libs/client/_general/constants/table-constant";
import { useWorkerUpdateStore } from "@/components/store/setting/worker/worker-update-store-provider";

export default function WorkerPostTable() {
  const workerId = useWorkerUpdateStore(state => state.workerId)
  const workerName = useWorkerUpdateStore(state => state.workerName)
  const posts = useWorkerUpdateStore(state => state.posts)

  const [sorting, setSorting] = useState<SortingState>([{
    id: 'name',
    desc: false,
  }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = getColumns(workerId, workerName);

  const table = useReactTable({
    data: posts,
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