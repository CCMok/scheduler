'use client'

import { ReactNode } from "react";
import { PostsPostWorkersCount } from '@/libs/server/post/models/post-dao';
import PostWorkersCountTable from '@/components/post/post-workers-count-table';
import { getActionColumn, nameColumn, workerCountColumn } from "@/components/post/post-workers-count-table-column";
import WorkerPostTableRowAction from "./worker-post-table-row-action";
import { ColumnDef } from "@tanstack/react-table";

const actionColumn = getActionColumn(({ row }) => (
  <WorkerPostTableRowAction id={row.original.id} name={row.original.name} />
))

const columns: ColumnDef<PostsPostWorkersCount>[] = [
  nameColumn,
  workerCountColumn,
  actionColumn,
]

type Props = {
  posts: PostsPostWorkersCount[];
  button?: ReactNode;
}

export default function WorkerPostTable({
  posts,
  button,
}: Readonly<Props>) {
  return (
    <PostWorkersCountTable 
      data={posts}
      button={button}
      columns={columns}
    />
  )
}