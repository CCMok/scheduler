import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { Department } from "@/external/prisma-generated";
import DepartmentTableRowAction from "@/components/department/department-table-row-action";
import { PATH } from "@/libs/share/_general/utils/path";

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
      <DepartmentTableRowAction
        id={row.original.id}
        name={row.original.name}
        editPath={PATH.setting.organizations.departments.build(row.original.organizationId, row.original.id)}
      />
    ),
  },
]