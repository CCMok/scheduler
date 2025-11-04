import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import UserTableRowAction from "./user-table-row-action";
import { UserExcludePasswordWithRole } from "@/libs/user/models/user-dao";

export enum UserTableId {
  EMAIL = 'email',
  NAME = 'name',
  ACTIONS = 'actions',
  ROLE_NAME = 'roleName',
}

export const getColumns = (): ColumnDef<UserExcludePasswordWithRole>[] => [
  {
    accessorKey: UserTableId.EMAIL,
    header: ({ column }) => (
      <TableSortableHeader
        title="電郵地址"
        column={column}
      />
    ),
  },
  {
    accessorKey: UserTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader
        title="名稱"
        column={column}
      />
    ),
  },
  {
    id: UserTableId.ROLE_NAME,
    accessorFn: row => row.role.name,
    header: ({ column }) => (
      <TableSortableHeader
        title="權限"
        column={column}
      />
    ),
  },
  {
    id: UserTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <UserTableRowAction
        id={row.original.id}
      />
    ),
  },
]