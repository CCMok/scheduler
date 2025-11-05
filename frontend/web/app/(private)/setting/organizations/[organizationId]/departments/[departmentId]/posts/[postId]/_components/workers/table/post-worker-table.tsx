'use client'

import { WorkerWithPostWorkersCount } from "@/libs/worker/models/worker-dao";
import { getActionColumn, getNameColumn, postCountColumn } from '@/components/worker/workers-post-count-table-column';
import PostWorkerTableRowAction from './post-worker-table-row-action';
import WorkerPostsCountTable from '@/components/worker/worker-posts-count-table';
import { useMemo } from "react";

type Props = {
  workers: WorkerWithPostWorkersCount[];
  postId: number;
}

export default function PostWorkerTable({
  workers,
  postId,
}: Readonly<Props>) {
  const columns = useMemo(() => [
    getNameColumn(false),
    postCountColumn,
    getActionColumn(({ row }) => (
      <PostWorkerTableRowAction
        id={row.original.id}
        name={row.original.name}
        postId={postId}
      />
    )),
  ], [postId])

  return (
    <WorkerPostsCountTable
      data={workers}
      columns={columns}
    />
  )
}