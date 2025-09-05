import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import WorkerTableRowAction from "@/components/worker/worker-table-row-action";
import { WorkerPostsCount } from "@/libs/server/worker/models/worker-dao";

export enum WorkerIndividualTableId {
  NAME = 'name',
  POST_COUNT = 'postCount',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<WorkerPostsCount>[] = [
  {
    accessorKey: WorkerIndividualTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="人員名稱" column={column} />
    ),
  },
  {
    id: WorkerIndividualTableId.POST_COUNT,
    accessorFn: row => row._count.postWorkers,
    header: ({ column }) => (
      <TableSortableHeader title="職位數量" column={column} />
    ),
  },
  {
    id: WorkerIndividualTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <WorkerTableRowAction id={row.original.id} name={row.original.name} />
    ),
  },
]