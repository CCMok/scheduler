import { CellContext, ColumnDef, ColumnDefTemplate } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";

export enum WorkerTableId {
  NAME = 'name',
  POST_COUNT = 'postCount',
  ACTIONS = 'actions',
}

export const nameColumn: ColumnDef<WorkersPostWorkerCount> =  {
  accessorKey: WorkerTableId.NAME,
  header: ({ column }) => (
    <TableSortableHeader title="人員名稱" column={column} />
  ),
}

export const postCountColumn: ColumnDef<WorkersPostWorkerCount> = {
  id: WorkerTableId.POST_COUNT,
  accessorFn: row => row._count.postWorkers,
  header: ({ column }) => (
    <TableSortableHeader title="職位數量" column={column} />
  ),
}

export const getActionColumn = (cell: ColumnDefTemplate<CellContext<WorkersPostWorkerCount, unknown>>): ColumnDef<WorkersPostWorkerCount> => {
  return {
    id: WorkerTableId.ACTIONS,
    header: '動作',
    cell,
  }
}