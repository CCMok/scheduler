'use client'

import CustomTable from "@/components/table/custom-table"
import { TABLE_DEFAULT_PAGE_SIZE } from "@/libs/client/_general/constants/table-constant";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { useState } from "react";
import { columns, DepartmentTableId } from "./department-table-column";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";

type Props = {
  departments: DepartmentOrganization[];
}

export default function DepartmentTable({
  departments,
}: Readonly<Props>) {
  const [sorting, setSorting] = useState<SortingState>([{
    id: DepartmentTableId.ORGANIZATION_NAME,
    desc: false,
  }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: departments,
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
  })

  return (
    <CustomTable table={table} />
  )
}