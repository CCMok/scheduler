'use client'

import useTable from '@/components/_general/table/use-table';
import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Param } from '@/libs/share/_general/enums/param';
import { isNil } from 'lodash';
import { ColumnDef } from '@tanstack/react-table';
import { WorkerTableId } from './workers-post-count-table-column';
import CustomTable from '../_general/table/custom-table';

type Props = {
  data?: WorkersPostWorkerCount[];
  columns?: ColumnDef<WorkersPostWorkerCount>[];
}

export default function WorkerPostsCountTable({
  data =[],
  columns = [],
}: Readonly<Props>) {
  const table = useTable({
    data,
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
    <CustomTable
      table={table}
    />
  )
}