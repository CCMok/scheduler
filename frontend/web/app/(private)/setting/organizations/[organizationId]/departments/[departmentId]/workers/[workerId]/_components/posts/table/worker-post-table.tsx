'use client'

import { PostWithPostWorkersCount } from '@/libs/post/models/post-dao';
import PostWorkersCountTable from '@/components/post/post-workers-count-table';
import { getActionColumn, getNameColumn, workerCountColumn } from "@/components/post/post-workers-count-table-column";
import WorkerPostTableRowAction from "./worker-post-table-row-action";
import { useMemo } from 'react';

type Props = {
  posts: PostWithPostWorkersCount[];
  workerId: number;
}

export default function WorkerPostTable({
  posts,
  workerId,
}: Readonly<Props>) {
  const columns = useMemo(() => [
    getNameColumn(false),
    workerCountColumn,
    getActionColumn(({ row }) => (
      <WorkerPostTableRowAction
        id={row.original.id}
        name={row.original.name}
        workerId={workerId}
      />
    )),
  ], [workerId])

  return (
    <PostWorkersCountTable
      data={posts}
      columns={columns}
    />
  )
}