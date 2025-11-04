import { CellContext, ColumnDef, ColumnDefTemplate } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { WorkerWithPostWorkersCount } from "@/libs/worker/models/worker-dao";
import WorkerNameCell from "./worker-name-cell";

export enum WorkerTableId {
  NAME = 'name',
  POST_COUNT = 'postCount',
  ACTIONS = 'actions',
}

export const getNameColumn = (isEditable: boolean): ColumnDef<WorkerWithPostWorkersCount> => ({
  accessorKey: WorkerTableId.NAME,
  header: ({ column }) => (
    <TableSortableHeader title="人員名稱" column={column} />
  ),
  ...(isEditable
    ? {
      cell: ({ row }) => (
        <WorkerNameCell id={row.original.id} name={row.original.name} />
      ),
    }
    : {}),
})

export const postCountColumn: ColumnDef<WorkerWithPostWorkersCount> = {
  id: WorkerTableId.POST_COUNT,
  accessorFn: row => row._count.postWorkers,
  header: ({ column }) => (
    <TableSortableHeader title="職位數量" column={column} />
  ),
}

export const getActionColumn = (cell: ColumnDefTemplate<CellContext<WorkerWithPostWorkersCount, unknown>>): ColumnDef<WorkerWithPostWorkersCount> => {
  return {
    id: WorkerTableId.ACTIONS,
    header: '動作',
    cell,
  }
}