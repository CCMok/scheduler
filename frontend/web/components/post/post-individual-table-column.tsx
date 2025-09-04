import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { Post } from "@/external/prisma-generated";
import PostTableRowAction from "@/components/post/post-table-row-action";

export enum PostIndividualTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: PostIndividualTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="職位名稱" column={column} />
    ),
  },
  {
    id: PostIndividualTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <PostTableRowAction id={row.original.id} name={row.original.name} />
    ),
  },
]