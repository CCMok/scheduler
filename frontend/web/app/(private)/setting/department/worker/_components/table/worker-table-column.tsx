import { Worker } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import WorkerTableRowAction from "./row-action/worker-table-row-action";
import TableSortableHeader from "@/components/table/table-sortable-header";

export const columns: ColumnDef<Worker>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <TableSortableHeader title="員工名稱" column={column} />
    ),
  },
  {
    id: 'actions',
    header: '動作',
    cell: ({ row }) => (
      <WorkerTableRowAction workerId={row.original.id} workerName={row.original.name} />
    ),
  },
]