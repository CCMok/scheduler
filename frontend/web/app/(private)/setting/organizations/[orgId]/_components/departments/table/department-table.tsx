'use client'

import useTable from '@/components/_general/table/use-table';
import { DepartmentTableId, columns } from "./department-table-column";
import { DepartmentChildrenCount } from '@/libs/server/department/models/department-dao';
import { useSearchParams } from 'next/navigation';
import { Param } from '@/libs/share/_general/enums/param';
import { ReactNode, useEffect } from 'react';
import { isNil } from 'lodash';
import ButtonTable from '@/components/_general/table/button-table';

type Props = {
  departments: DepartmentChildrenCount[];
  button?: ReactNode;
}

export default function DepartmentTable({
  departments,
  button,
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
    <ButtonTable
      table={table}
      button={button}
    />
  )
}