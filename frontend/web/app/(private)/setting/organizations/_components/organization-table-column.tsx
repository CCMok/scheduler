import { Organization } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";
import OrganizationTableRowAction from "./organization-table-row-action";

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <TableSortableHeader title="部門名稱" column={column} />
    ),
  },
  {
    id: 'actions',
    header: '動作',
    cell: ({ row }) => (
      <OrganizationTableRowAction organizationId={row.original.id} organizationName={row.original.name} />
    ),
  },
]