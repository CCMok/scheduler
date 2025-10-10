import { ColumnDef } from "@tanstack/react-table";
import PostNameFormField from "./post-name-form-field";
import RemoveButton from "@/components/_general/button/remove-button";

export type PostTableData = {
  id: string;
  index: number;
  onRemove: (index: number) => void;
}

export enum PostTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<PostTableData>[] = [
  {
    id: PostTableId.NAME,
    header: '職位名稱',
    cell: ({ row }) => (
      <PostNameFormField index={row.original.index} />
    ),
  },
  {
    id: PostTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <RemoveButton onClick={() => row.original.onRemove(row.original.index)} />
    ),
  },
]