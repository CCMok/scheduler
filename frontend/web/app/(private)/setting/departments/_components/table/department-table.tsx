'use client'

import useTable from '@/components/_general/table/use-table';
import { DepartmentOrganizationChildrenCount } from '@/libs/server/department/models/department-dao';
import { useSearchParams } from 'next/navigation';
import CustomTable from '@/components/_general/table/custom-table';
import { DepartmentTableId, columns } from './department-table-column';
import { Param } from '@/libs/share/_general/enums/param';
import { useEffect } from 'react';

type Props = {
  departments: DepartmentOrganizationChildrenCount[];
}

export default function DepartmentTable({
  departments,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const organizationName = searchParams.get(Param.ORGANIZATION_NAME);
  const departmentName = searchParams.get(Param.DEPARTMENT_NAME);

  const table = useTable({
    data: departments,
    columns,
    defaultSorting: [{
      id: DepartmentTableId.ORGANIZATION_NAME,
      desc: false,
    }],
    // Ensure filter apply in 1st render
    defaultColumnFilters: [
      ...(organizationName ? [{ id: DepartmentTableId.ORGANIZATION_NAME, value: organizationName }] : []),
      ...(departmentName ? [{ id: DepartmentTableId.DEPARTMENT_NAME, value: departmentName }] : []),
    ],
  })

  useEffect(() => {
    table.getColumn(DepartmentTableId.ORGANIZATION_NAME)?.setFilterValue(organizationName);
    table.getColumn(DepartmentTableId.DEPARTMENT_NAME)?.setFilterValue(departmentName);
  }, [table, organizationName, departmentName])

  return (
    <CustomTable
      table={table}
    />
  )
}