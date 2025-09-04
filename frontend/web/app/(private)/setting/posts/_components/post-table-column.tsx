import { ColumnDef } from "@tanstack/react-table";
import TableSortableHeader from '@/components/_general/table/table-sortable-header';
import { PostDeptOrg } from "@/libs/server/post/models/post-dao";
import PostTableRowAction from "../../../../../components/post/post-table-row-action";

export enum PostTableId {
  ORGANIZATION_NAME = 'organizationName',
  DEPARTMENT_NAME = 'departmentName',
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<PostDeptOrg>[] = [
  {
    id: PostTableId.ORGANIZATION_NAME,
    accessorFn: row => row.department.organization.name,
    header: ({ column }) => (
      <TableSortableHeader title="組織名稱" column={column} />
    ),
  },
  {
    id: PostTableId.DEPARTMENT_NAME,
    accessorFn: row => row.department.name,
    header: ({ column }) => (
      <TableSortableHeader title="部門名稱" column={column} />
    ),
  },
  {
    accessorKey: PostTableId.NAME,
    header: ({ column }) => (
      <TableSortableHeader title="職位名稱" column={column} />
    ),
  },
  {
    id: PostTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <PostTableRowAction id={row.original.id} name={row.original.name} />
    ),
  },
]