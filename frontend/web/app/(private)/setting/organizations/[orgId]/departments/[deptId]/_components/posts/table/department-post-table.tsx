'use client'

import { PostsPostWorkersCount } from '@/libs/server/post/models/post-dao';
import PostWorkersCountTable from '@/components/post/post-workers-count-table';
import { ColumnDef } from "@tanstack/react-table";
import { getActionColumn, getNameColumn, workerCountColumn } from "@/components/post/post-workers-count-table-column";
import DepartmentPostTableRowAction from "./department-post-table-row-action";

const actionColumn = getActionColumn(({ row }) => (
  <DepartmentPostTableRowAction id={row.original.id} name={row.original.name} />
))

const columns: ColumnDef<PostsPostWorkersCount>[] = [
  getNameColumn(true),
  workerCountColumn,
  actionColumn,
]

type Props = {
  posts: PostsPostWorkersCount[];
}

export default function DepartmentPostTable({
  posts,
}: Readonly<Props>) {
  return (
    <PostWorkersCountTable 
      data={posts}
      columns={columns}
    />
  )
}