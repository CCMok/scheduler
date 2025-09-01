'use client'

import CustomTable from "@/components/table/custom-table"
import { columns, DepartmentTableId } from "./department-table-column";
import { Department } from "@/external/prisma-generated";
import useTable from "@/components/table/use-table";

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