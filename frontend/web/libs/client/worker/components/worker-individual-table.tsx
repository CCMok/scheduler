'use client'

import useTable from "@/components/table/use-table";
import { Worker } from "@/external/prisma-generated";
import { WorkerIndividualTableId, columns } from "./worker-individual-table-column";
import CustomTable from "@/components/table/custom-table";

type Props = {
  workers: Worker[];
}

export default function WorkerIndividualTable({
  workers,
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
    <CustomTable table={table} />
  )
}