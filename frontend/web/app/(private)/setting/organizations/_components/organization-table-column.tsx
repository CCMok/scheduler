import { Organization } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";
import OrganizationTableRowAction from "./organization-table-row-action";

export enum OrganizationTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: OrganizationTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="部門名稱" column={column} />
    ),
  },
  {
    id: OrganizationTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <OrganizationTableRowAction id={row.original.id} name={row.original.name} />
    ),
  },
]