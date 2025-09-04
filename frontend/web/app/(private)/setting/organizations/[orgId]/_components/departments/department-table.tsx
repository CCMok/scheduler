'use client'

import useTable from '@/components/_general/table/use-table';
import { DepartmentTableId, columns } from "./department-table-column";
import CustomTable from '@/components/_general/table/custom-table';
import { DepartmentChildrenCount } from '@/libs/server/department/models/department-dao';

type Props = {
  departments: DepartmentChildrenCount[];
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