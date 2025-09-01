'use client'

import CustomTable from "@/components/table/custom-table"
import { columns, DepartmentTableId } from "./department-table-column";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";
import useTable from "@/components/table/use-table";

type Props = {
  departments: DepartmentOrganization[];
}

export default function DepartmentTable({
  departments,
}: Readonly<Props>) {
  const table = useTable({
    data: departments,
    columns,
    defaultSorting: [{
      id: DepartmentTableId.ORGANIZATION_NAME,
      desc: false,
    }],
  })

  return (
    <CustomTable table={table} />
  )
}