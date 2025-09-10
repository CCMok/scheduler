import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import PostTableRowAction from "@/components/post/post-table-row-action";
import { PostWorkersCount } from "@/libs/server/post/models/post-dao";

export enum PostTableId {
  NAME = 'name',
  WORKER_COUNT = 'workerCount',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<PostWorkersCount>[] = [
  {
    accessorKey: PostTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="職位名稱" column={column} />
    ),
  },
  {
    id: PostTableId.WORKER_COUNT,
    accessorFn: row => row._count.postWorkers,
    header: ({ column }) => (
      <TableSortableHeader title="人員數量" column={column} />
    ),
  },
  {
    id: PostTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <PostTableRowAction id={row.original.id} name={row.original.name} />
    ),
  },
]