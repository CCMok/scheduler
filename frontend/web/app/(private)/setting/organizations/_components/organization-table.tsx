'use client'

import { Organization } from "@/external/prisma-generated";
import { useMemo, useState } from "react";
import CustomTable from "@/components/table/custom-table";
import { getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { TABLE_DEFAULT_PAGE_SIZE } from "@/libs/client/_general/constants/table-constant";
import { columns } from "./organization-table-column";
import { useSearchParams } from "next/navigation";
import { Param } from "@/libs/share/_general/enums/param";

type Props = {
  organizations: Organization[];
}

export default function OrganizationTable({
  organizations,
}: Readonly<Props>) {
  const [sorting, setSorting] = useState<SortingState>([{
    id: 'name',
    desc: false,
  }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const searchParams = useSearchParams();
  const id = searchParams.get(Param.ID);

  const filteredOrganizations = useMemo(() => {
    return id ? organizations.filter(organization => organization.id.toString() === id) : organizations;
  }, [id, organizations])

  const table = useReactTable({
    data: filteredOrganizations,
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