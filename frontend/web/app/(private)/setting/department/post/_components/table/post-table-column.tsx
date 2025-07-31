import { Post } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import PostTableRowActions from "./post-table-row-actions";
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
      <PostTableRowActions postId={row.original.departmentId} />
    ),
  },
]