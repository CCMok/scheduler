'use client'

import CustomTable from '@/components/_general/table/custom-table'
import { columns, DepartmentTableId } from "./department-table-column";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";
import useTable from '@/components/_general/table/use-table';
import { useSearchParams } from "next/navigation";
import { DepartmentParam } from "./department-param";
import { useEffect } from "react";

type Props = {
  departments: DepartmentOrganization[];
}

export default function DepartmentTable({
  departments,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const name = searchParams.get(DepartmentParam.NAME);

  const table = useTable({
    data: departments,
    columns,
    defaultSorting: [{
      id: DepartmentTableId.ORGANIZATION_NAME,
      desc: false,
    }],
    defaultColumnFilters: [{
      id: DepartmentTableId.NAME,
      value: name ?? '',
    }],
  })

  useEffect(() => {
    table.getColumn(DepartmentTableId.NAME)?.setFilterValue(name);
  }, [name, table])

  return (
    <CustomTable table={table} />
  )
}