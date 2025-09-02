import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";
import DepartmentTableRowAction from "./department-table-row-action";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";

export enum DepartmentTableId {
  ORGANIZATION_NAME = 'organizationName',
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<DepartmentOrganization>[] = [
  {
    id: DepartmentTableId.ORGANIZATION_NAME,
    accessorFn: row => row.organization.name,
    header: ({ column }) => (
      <TableSortableHeader title="組織名稱" column={column} />
    ),
  },
  {
    accessorKey: DepartmentTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="部門名稱" column={column} />
    ),
  },
  {
    id: DepartmentTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <DepartmentTableRowAction id={row.original.id} name={row.original.name} />
    ),
  },
]