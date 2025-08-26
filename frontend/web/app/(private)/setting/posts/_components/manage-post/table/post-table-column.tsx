import { Post } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import PostTableRowAction from "./row-action/post-table-row-action";
import TableSortableHeader from "@/components/table/table-sortable-header";

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <TableSortableHeader title="職位名稱" column={column} />
    ),
  },
  {
    id: 'actions',
    header: '動作',
    cell: ({ row }) => (
      <PostTableRowAction postId={row.original.id} postName={row.original.name} />
    ),
  },
]