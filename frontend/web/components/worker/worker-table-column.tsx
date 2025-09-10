import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import WorkerTableRowAction from "@/components/worker/worker-table-row-action";
import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";

export enum WorkerTableId {
  NAME = 'name',
  POST_COUNT = 'postCount',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<WorkersPostWorkerCount>[] = [
  {
    accessorKey: WorkerTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="人員名稱" column={column} />
    ),
  },
  {
    id: WorkerTableId.POST_COUNT,
    accessorFn: row => row._count.postWorkers,
    header: ({ column }) => (
      <TableSortableHeader title="職位數量" column={column} />
    ),
  },
  {
    id: WorkerTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <WorkerTableRowAction id={row.original.id} name={row.original.name} />
    ),
  },
]