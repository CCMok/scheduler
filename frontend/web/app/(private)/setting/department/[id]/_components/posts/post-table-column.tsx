import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";
import { Post } from "@/external/prisma-generated";
import PostTableRowAction from "@/libs/client/post/components/post-table-row-action";

export enum PostTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: PostTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="職位名稱" column={column} />
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