'use client'

import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";
import { getActionColumn, getNameColumn, postCountColumn } from '@/components/worker/workers-post-count-table-column';
import PostWorkerTableRowAction from './post-worker-table-row-action';
import { ColumnDef } from '@tanstack/react-table';
import WorkerPostsCountTable from '@/components/worker/worker-posts-count-table';

const actionColumn = getActionColumn(({ row }) => (
  <PostWorkerTableRowAction id={row.original.id} name={row.original.name} />
))

const columns: ColumnDef<WorkersPostWorkerCount>[] = [
  getNameColumn(false),
  postCountColumn,
  actionColumn,
]

type Props = {
  workers: WorkersPostWorkerCount[];
}

export default function PostWorkerTable({
  workers,
}: Readonly<Props>) {
  return (
    <WorkerPostsCountTable 
      data={workers}
      columns={columns}
    />
  )
}