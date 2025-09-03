import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";
import { WorkerDeptOrg } from "@/libs/server/worker/models/worker-dao";
import WorkerTableRowAction from "../../../../../libs/client/worker/components/worker-table-row-action";

export enum WorkerTableId {
  ORGANIZATION_NAME = 'organizationName',
  DEPARTMENT_NAME = 'departmentName',
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<WorkerDeptOrg>[] = [
  {
    id: WorkerTableId.ORGANIZATION_NAME,
    accessorFn: row => row.department.organization.name,
    header: ({ column }) => (
      <TableSortableHeader title="組織名稱" column={column} />
    ),
  },
  {
    id: WorkerTableId.DEPARTMENT_NAME,
    accessorFn: row => row.department.name,
    header: ({ column }) => (
      <TableSortableHeader title="部門名稱" column={column} />
    ),
  },
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
      <WorkerTableRowAction id={row.original.id} name={row.original.name} />
    ),
  },
]