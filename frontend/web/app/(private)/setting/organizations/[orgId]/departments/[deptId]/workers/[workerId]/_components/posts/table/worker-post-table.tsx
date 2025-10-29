'use client'

import { PostsPostWorkersCount } from '@/libs/server/post/models/post-dao';
import PostWorkersCountTable from '@/components/post/post-workers-count-table';
import { getActionColumn, getNameColumn, workerCountColumn } from "@/components/post/post-workers-count-table-column";
import WorkerPostTableRowAction from "./worker-post-table-row-action";
import { ColumnDef } from "@tanstack/react-table";

const actionColumn = getActionColumn(({ row }) => (
  <WorkerPostTableRowAction id={row.original.id} name={row.original.name} />
))

const columns: ColumnDef<PostsPostWorkersCount>[] = [
  getNameColumn(false),
  workerCountColumn,
  actionColumn,
]

type Props = {
  posts: PostsPostWorkersCount[];
}

export default function WorkerPostTable({
  posts,
}: Readonly<Props>) {
  return (
    <PostWorkersCountTable 
      data={posts}
      columns={columns}
    />
  )
}