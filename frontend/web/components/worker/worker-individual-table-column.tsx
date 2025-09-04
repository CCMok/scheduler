import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { Worker } from "@/external/prisma-generated";
import WorkerTableRowAction from "@/components/worker/worker-table-row-action";

export enum WorkerIndividualTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<Worker>[] = [
  {
    accessorKey: WorkerIndividualTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="人員名稱" column={column} />
    ),
  },
  {
    id: WorkerIndividualTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <WorkerTableRowAction id={row.original.id} name={row.original.name} />
    ),
  },
]