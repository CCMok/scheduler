import { Department } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <TableSortableHeader title="部門名稱" column={column} />
    ),
  },
  // TODO
  // {
  //   id: 'actions',
  //   header: '動作',
  //   cell: ({ row }) => (
  //     <PostTableRowAction postId={row.original.id} postName={row.original.name} />
  //   ),
  // },
]