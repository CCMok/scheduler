'use client'

import useTable from '@/components/_general/table/use-table';
import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";
import { WorkerIndividualTableId, columns } from "./worker-individual-table-column";
import ButtonTable from '@/components/_general/table/button-table';
import { ReactNode } from "react";

type Props = {
  workers: WorkersPostWorkerCount[];
  button?: ReactNode;
}

export default function WorkerIndividualTable({
  workers,
  button,
}: Readonly<Props>) {
  const table = useTable({
    data: workers,
    columns,
    defaultSorting: [{
      id: WorkerIndividualTableId.NAME,
      desc: false,
    }],
  })
  
  return (
    <ButtonTable
      table={table}
      button={button}
    />
  )
}