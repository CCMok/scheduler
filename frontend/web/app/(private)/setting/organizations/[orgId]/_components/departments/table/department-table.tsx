'use client'

import useTable from '@/components/_general/table/use-table';
import { DepartmentTableId, columns } from "./department-table-column";
import { DepartmentWithChildCount } from '@/libs/department/models/department-dao';
import { useSearchParams } from 'next/navigation';
import { Param } from '@/libs/_general/enums/param';
import { useEffect } from 'react';
import CustomTable from '@/components/_general/table/custom-table';

type Props = {
  departments: DepartmentWithChildCount[];
}

export default function DepartmentTable({
  departments,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const name = searchParams.get(Param.NAME);

  const table = useTable({
    data: departments,
    columns,
    defaultSorting: [{
      id: DepartmentTableId.NAME,
      desc: false,
    }],
    defaultColumnFilters: [
      ...(name ? [{ id: DepartmentTableId.NAME, value: name }] : []),
    ],
  })

  useEffect(() => {
    table.getColumn(DepartmentTableId.NAME)?.setFilterValue(name);
  }, [name, table])

  return (
    <CustomTable
      table={table}
    />
  )
}