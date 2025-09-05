'use client'

import useTable from '@/components/_general/table/use-table';
import { DepartmentTableId, columns } from "./department-table-column";
import CustomTable from '@/components/_general/table/custom-table';
import { DepartmentChildrenCount } from '@/libs/server/department/models/department-dao';
import { useSearchParams } from 'next/navigation';
import { Param } from '@/libs/share/_general/enums/param';
import { useEffect } from 'react';
import { isNil } from 'lodash';

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

  const searchParams = useSearchParams();
  const name = searchParams.get(Param.NAME);

  useEffect(() => {
    if (!isNil(name)) {
      table.getColumn(DepartmentTableId.NAME)?.setFilterValue(name);
    }
  }, [name, table])
  
  return (
    <CustomTable table={table} />
  )
}