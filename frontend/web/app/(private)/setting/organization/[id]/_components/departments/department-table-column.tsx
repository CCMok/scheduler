import { Department } from "@/external/prisma-generated";
import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from "@/components/table/table-sortable-header";
import DepartmentTableRowAction from "@/libs/client/department/components/department-table-row-action";

export enum DepartmentTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<Department>[] = [
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