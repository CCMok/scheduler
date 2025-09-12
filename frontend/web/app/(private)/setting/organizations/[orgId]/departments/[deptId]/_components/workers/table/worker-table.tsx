'use client'

import useTable from '@/components/_general/table/use-table';
import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";
import { WorkerTableId, columns } from "./worker-table-column";
import ButtonTable from '@/components/_general/table/button-table';
import { ReactNode, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Param } from '@/libs/share/_general/enums/param';
import { isNil } from 'lodash';

type Props = {
  workers: WorkersPostWorkerCount[];
  button?: ReactNode;
}

export default function WorkerTable({
  workers,
  button,
}: Readonly<Props>) {
  const table = useTable({
    data: workers,
    columns,
    defaultSorting: [{
      id: WorkerTableId.NAME,
      desc: false,
    }],
  })

  const searchParams = useSearchParams();
  const name = searchParams.get(Param.NAME);

  useEffect(() => {
    if (!isNil(name)) {
      table.getColumn(WorkerTableId.NAME)?.setFilterValue(name);
    }
  }, [name, table])

  return (
    <ButtonTable
      table={table}
      button={button}
    />
  )
}