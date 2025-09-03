'use client'

import useTable from "@/components/table/use-table";
import { Department } from "@/external/prisma-generated";
import { DepartmentTableId, columns } from "./department-table-column";
import CustomTable from "@/components/table/custom-table";

type Props = {
  departments: Department[];
}

export default function DepartmentTable({
  departments,
}: Readonly<Props>) {
  const table = useTable({
    data: departments,
    columns,
    defaultSorting: [{
      id: DepartmentTableId.NAME,
      desc: false,
    }],
  })
  
  return (
    <CustomTable table={table} />
  )
}