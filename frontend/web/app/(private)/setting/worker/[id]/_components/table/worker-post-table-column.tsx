import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";
import { Post } from "@/external/prisma-generated";
import WorkerPostTableRowAction from "./row-action/worker-post-table-row-action";

export enum WorkerPostTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const getColumns = (workerId: number, workerName: string): ColumnDef<Post>[] => [
  {
    accessorKey: WorkerPostTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="職位名稱" column={column} />
    ),
  },
  {
    id: WorkerPostTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <WorkerPostTableRowAction
        workerId={workerId}
        workerName={workerName}
        postId={row.original.id}
        postName={row.original.name}
      />
    ),
  },
]