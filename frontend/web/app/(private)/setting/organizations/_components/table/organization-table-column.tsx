import { Organization } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import OrganizationTableRowAction from "./organization-table-row-action";
import { Role } from "@/libs/share/_general/enums/role";
import InlineEditableCell from "@/components/_general/table/inline-editable-cell";

export enum OrganizationTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const getColumns = (role?: Role): ColumnDef<Organization>[] => [
  {
    accessorKey: OrganizationTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader
        title="組織名稱"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <InlineEditableCell value={row.original.name} />
    ),
  },
  {
    id: OrganizationTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <OrganizationTableRowAction
        id={row.original.id}
        role={role}
        name={row.original.name}
      />
    ),
  },
]