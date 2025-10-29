import { Organization } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import UserOrganizationTableRowAction from "./user-oragnization-table-row-action";

export enum UserOrganizationTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: UserOrganizationTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader
        title="機構名稱"
        column={column}
      />
    ),
  },
  {
    id: UserOrganizationTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <UserOrganizationTableRowAction
        organizationId={row.original.id}
        name={row.original.name}
      />
    ),
  },
]