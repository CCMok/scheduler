import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { DepartmentOrganizationChildrenCount } from '@/libs/server/department/models/department-dao';
import DepartmentTableRowAction from "@/app/(private)/setting/organizations/[orgId]/_components/departments/table/department-table-row-action";
import { PATH } from "@/libs/share/_general/utils/path";
import DepartmentNameCell from "../../../organizations/[orgId]/_components/departments/table/department-name-cell";

export enum DepartmentTableId {
  ORGANIZATION_NAME = 'organizationName',
  DEPARTMENT_NAME = 'departmentName',
  POST_COUNT = 'postCount',
  WORKER_COUNT = 'workerCount',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<DepartmentOrganizationChildrenCount>[] = [
  {
    id: DepartmentTableId.ORGANIZATION_NAME,
    accessorFn: row => row.organization.name,
    header: ({ column }) => (
      <TableSortableHeader title="組織名稱" column={column} />
    ),
  },
  {
    id: DepartmentTableId.DEPARTMENT_NAME,
    accessorFn: row => row.name,
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