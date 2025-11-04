'use client'

import useTable from '@/components/_general/table/use-table';
import CustomTable from "@/components/_general/table/custom-table";
import { RosterHistoryWithRelated } from "@/libs/roster/models/roster-history-dao";
import { columns, RosterHistoryTableId } from "./roster-history-table-column";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Param } from '@/libs/_general/enums/param';

type Props = {
  rosterHistories: RosterHistoryWithRelated[];
}

export default function RosterHistoryTable({
  rosterHistories,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const organizationName = searchParams.get(Param.ORGANIZATION_NAME);
  const departmentName = searchParams.get(Param.DEPARTMENT_NAME);
  const createDateFrom = searchParams.get(Param.CREATE_DATE_FROM);
  const createDateTo = searchParams.get(Param.CREATE_DATE_TO);

  const table = useTable({
    data: rosterHistories,
    columns,
    defaultSorting: [{
      id: RosterHistoryTableId.CREATED_AT,
      desc: true,
    }],
  })

  useEffect(() => {
    table.getColumn(RosterHistoryTableId.ORGANIZATION_NAME)?.setFilterValue(organizationName);
    table.getColumn(RosterHistoryTableId.DEPARTMENT_NAME)?.setFilterValue(departmentName);
    table.getColumn(RosterHistoryTableId.CREATED_AT)?.setFilterValue({
      from: createDateFrom ? new Date(createDateFrom) : undefined,
      to: createDateTo ? new Date(createDateTo) : undefined,
    });
  }, [table, organizationName, departmentName, createDateFrom, createDateTo])

  return (
    <CustomTable
      table={table}
    />
  )
}