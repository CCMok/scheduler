import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";
import { Worker } from "@/external/prisma-generated";
import PostWorkerTableRowAction from "./row-action/post-worker-table-row-action";

export const getColumns = (postId: number, postName: string): ColumnDef<Worker>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <TableSortableHeader title="人員名稱" column={column} />
    ),
  },
  {
    id: 'actions',
    header: '動作',
    cell: ({ row }) => (
      <PostWorkerTableRowAction
        postId={postId}
        postName={postName}
        workerId={row.original.id}
        workerName={row.original.name}
      />
    ),
  },
]