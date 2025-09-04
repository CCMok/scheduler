'use client'

import { useEffect } from "react";
import CustomTable from '@/components/_general/table/custom-table';
import { useSearchParams } from "next/navigation";
import useTable from '@/components/_general/table/use-table';
import { WorkerDeptOrg } from "@/libs/server/worker/models/worker-dao";
import { WorkerParam } from "./worker-param";
import { columns, WorkerTableId } from "./worker-table-column";

type Props = {
  workers: WorkerDeptOrg[];
}

export default function WorkerTable({
  workers,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const name = searchParams.get(WorkerParam.NAME);

  const table = useTable({
    data: workers,
    columns,
    defaultSorting: [
      {
        id: WorkerTableId.ORGANIZATION_NAME,
        desc: false,
      },
      {
        id: WorkerTableId.DEPARTMENT_NAME,
        desc: false,
      },
    ],
    defaultColumnFilters: [{
      id: WorkerTableId.NAME,
      value: name ?? '',
    }],
  })

  useEffect(() => {
    table.getColumn(WorkerTableId.NAME)?.setFilterValue(name);
  }, [name, table])

  return (
    <CustomTable table={table} />
  )
}