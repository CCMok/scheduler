import TableSortableHeader from "@/components/_general/table/table-sortable-header";
import { WorkerConstraintWithRelated } from "@/libs/server/worker-constraint/models/worker-constraint-dao";
import { ColumnDef } from "@tanstack/react-table";
import WorkerConstraintTableRowAction from "./worker-constraint-table-row-action";
import { WorkerConstraintType, Worker } from "@/external/prisma-generated";
import WorkerConstraintTableWorker from "./worker-constraint-table-worker";

export enum WorkerConstraintTableId {
  CONSTRAINT_TYPE = 'constraintType',
  WEIGHTTING = 'weighting',
  POSTS = 'workers',
  ACTIONS = 'actions',
}

export const getColumns = (workerConstraintTypes: WorkerConstraintType[], workers: Worker[]): ColumnDef<WorkerConstraintWithRelated>[] => [
  {
    id: WorkerConstraintTableId.CONSTRAINT_TYPE,
    accessorFn: row => row.workerConstraintType.name,
    header: ({ column }) => (
      <TableSortableHeader title="條件類型" column={column} />
    ),
  },
  {
    id: WorkerConstraintTableId.POSTS,
    header: '人員',
    cell: ({ row }) => <WorkerConstraintTableWorker workerConstraintWorkers={row.original.workerConstraintWorkers} />
  },
  {
    accessorKey: WorkerConstraintTableId.WEIGHTTING,
    header: ({ column }) => (
      <TableSortableHeader title="權重" column={column} />
    ),
  },
  {
    id: WorkerConstraintTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => <WorkerConstraintTableRowAction 
      workerConstraintTypeId={row.original.workerConstraintTypeId.toString()}
      weighting={row.original.weighting}
      workerIds={row.original.workerConstraintWorkers.map(worker => worker.workerId.toString())}
      workerConstraintTypes={workerConstraintTypes}
      workers={workers}
      id={row.original.id}
    />,
  }
]