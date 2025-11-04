import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { DepartmentWithChildCount } from '@/libs/department/models/department-dao';
import DepartmentTableRowAction from "@/app/(private)/setting/organizations/[orgId]/_components/departments/table/department-table-row-action";
import { PATH } from "@/libs/_general/enums/path";
import DepartmentNameCell from "./department-name-cell";

export enum DepartmentTableId {
  NAME = 'name',
  POST_COUNT = 'postCount',
  WORKER_COUNT = 'workerCount',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<DepartmentWithChildCount>[] = [
  {
    accessorKey: DepartmentTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="部門名稱" column={column} />
    ),
    cell: ({ row }) => (
      <DepartmentNameCell id={row.original.id} name={row.original.name} />
    ),
  },
  {
    id: DepartmentTableId.POST_COUNT,
    accessorFn: row => row._count.posts,
    header: ({ column }) => (
      <TableSortableHeader title="職位數量" column={column} />
    ),
  },
  {
    id: DepartmentTableId.WORKER_COUNT,
    accessorFn: row => row._count.workers,
    header: ({ column }) => (
      <TableSortableHeader title="人員數量" column={column} />
    ),
  },
  {
    id: DepartmentTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <DepartmentTableRowAction
        editPath={PATH.setting.organizations.departments.build(row.original.organizationId, row.original.id)}
        name={row.original.name}
        id={row.original.id}
      />
    ),
  },
]