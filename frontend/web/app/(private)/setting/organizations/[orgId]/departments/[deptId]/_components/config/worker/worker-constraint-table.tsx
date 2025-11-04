'use client'

import useTable from "@/components/_general/table/use-table";
import { WorkerConstraintWithRelated } from "@/libs/worker-constraint/models/worker-constraint-dao";
import { getColumns, WorkerConstraintTableId } from "./worker-constraint-table-column";
import CustomTable from "@/components/_general/table/custom-table";
import { WorkerConstraintType, Worker } from "@/external/prisma-generated";

type Props = {
  workerConstraints: WorkerConstraintWithRelated[];
  workerConstraintTypes: WorkerConstraintType[];
  workers: Worker[];
}

export default function WorkerConstraintTable({
  workerConstraints,
  workerConstraintTypes,
  workers,
}: Readonly<Props>) {
  const columns = getColumns(workerConstraintTypes, workers)

  const table = useTable({
    data: workerConstraints,
    columns,
    defaultSorting: [{
      id: WorkerConstraintTableId.CONSTRAINT_TYPE,
      desc: false,
    }],
  })

  return (
    <CustomTable
      table={table}
    />
  )
}