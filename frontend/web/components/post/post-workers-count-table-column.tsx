import { CellContext, ColumnDef, ColumnDefTemplate } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { PostsPostWorkersCount } from "@/libs/server/post/models/post-dao";
import PostNameCell from "./post-name-cell";

export enum PostTableId {
  NAME = 'name',
  WORKER_COUNT = 'workerCount',
  ACTIONS = 'actions',
}

export const getNameColumn = (isEditable: boolean): ColumnDef<PostsPostWorkersCount> => ({
  accessorKey: PostTableId.NAME,
  header: ({ column }) => (
    <TableSortableHeader title="職位名稱" column={column} />
  ),
  ...(isEditable
    ? {
      cell: ({ row }) => (
        <PostNameCell id={row.original.id} name={row.original.name} />
      ),
    }
    : {}),
})

export const workerCountColumn: ColumnDef<PostsPostWorkersCount> = {
  id: PostTableId.WORKER_COUNT,
  accessorFn: row => row._count.postWorkers,
  header: ({ column }) => (
    <TableSortableHeader title="人員數量" column={column} />
  ),
}

export const getActionColumn = (cell: ColumnDefTemplate<CellContext<PostsPostWorkersCount, unknown>>): ColumnDef<PostsPostWorkersCount> => {
  return {
    id: PostTableId.ACTIONS,
    header: '動作',
    cell,
  }
}