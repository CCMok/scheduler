import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";
import { Worker } from "@/external/prisma-generated";
import PostWorkerTableRowAction from "./post-worker-row-action";

export const columns: ColumnDef<Worker>[] = [
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
      <PostWorkerTableRowAction workerId={row.original.id} workerName={row.original.name} />
    ),
  },
]