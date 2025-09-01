import { Worker } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import WorkerTableRowAction from "./row-action/worker-table-row-action";
import TableSortableHeader from "@/components/table/table-sortable-header";

export enum WorkerTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<Worker>[] = [
  {
    accessorKey: WorkerTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="人員名稱" column={column} />
    ),
  },
  {
    id: WorkerTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <WorkerTableRowAction workerId={row.original.id} workerName={row.original.name} />
    ),
  },
]