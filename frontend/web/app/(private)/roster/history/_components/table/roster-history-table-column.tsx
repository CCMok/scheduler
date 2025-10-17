import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { RosterHistoryRelated } from "@/libs/server/roster/models/roster-history-dao";
import { format } from "date-fns";

export enum RosterHistoryTableId {
  ORGANIZATION_NAME = 'organizationName',
  DEPARTMENT_NAME = 'departmentName',
  CREATED_BY = 'createdBy',
  CREATED_AT = 'createdAt',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<RosterHistoryRelated>[] = [
  {
    id: RosterHistoryTableId.ORGANIZATION_NAME,
    accessorFn: row => row.department.organization.name,
    header: ({ column }) => (
      <TableSortableHeader
        title="組織名稱"
        column={column}
      />
    ),
  },
  {
    id: RosterHistoryTableId.DEPARTMENT_NAME,
    accessorFn: row => row.department.name,
    header: ({ column }) => (
      <TableSortableHeader
        title="部門名稱"
        column={column}
      />
    ),
  },
  {
    accessorKey: RosterHistoryTableId.CREATED_AT,
    header: ({ column }) => (
      <TableSortableHeader
        title="建立時間"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <span>{format(row.original.createdAt, 'yyyy-MM-dd HH:mm:ss')}</span>
    ),
  },
  {
    id: RosterHistoryTableId.CREATED_BY,
    accessorFn: row => row.createdByUser.name ?? row.createdByUser.email,
    header: ({ column }) => (
      <TableSortableHeader
        title="建立者"
        column={column}
      />
    ),
  },
  {
    id: RosterHistoryTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <></>
      // TODO
      // <OrganizationTableRowAction
      //   id={row.original.id}
      //   role={role}
      //   name={row.original.name}
      // />
    ),
  },
]