'use client'

import { useWorkerSettingStore } from "@/app/(private)/setting/workers/_components/manage-worker/store/worker-setting-store-provider"
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { columns } from "./worker-table-column";
import { useEffect, useState } from "react";
import { TABLE_DEFAULT_PAGE_SIZE } from "@/libs/client/_general/constants/table-constant";
import CustomTable from "@/components/table/custom-table";

export default function WorkerTable() {
  const workers = useWorkerSettingStore(state => state.workers);
  const workerNameFilter = useWorkerSettingStore(state => state.workerNameFilter);

  const [sorting, setSorting] = useState<SortingState>([{
    id: 'name',
    desc: false,
  }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: workers,
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
    table.getColumn('name')?.setFilterValue(workerNameFilter);
  }, [workerNameFilter, table])

  return (
    <CustomTable table={table} />
  )
}