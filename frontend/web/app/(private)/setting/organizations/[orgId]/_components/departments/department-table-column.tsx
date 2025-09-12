import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { DepartmentChildrenCount } from '@/libs/server/department/models/department-dao';
import DepartmentTableRowAction from "@/app/(private)/setting/organizations/[orgId]/_components/departments/department-table-row-action";
import { PATH } from "@/libs/share/_general/utils/path";

export enum DepartmentTableId {
  NAME = 'name',
  POST_COUNT = 'postCount',
  WORKER_COUNT = 'workerCount',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<DepartmentChildrenCount>[] = [
  {
    accessorKey: DepartmentTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="部門名稱" column={column} />
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
      />
    ),
  },
]