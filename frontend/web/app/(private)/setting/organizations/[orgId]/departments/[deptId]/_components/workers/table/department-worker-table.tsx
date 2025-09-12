'use client'

import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";
import { ReactNode } from "react";
import { getActionColumn, nameColumn, postCountColumn } from '@/components/worker/workers-post-count-table-column';
import DepartmentWorkerTableRowAction from './department-worker-table-row-action';
import { ColumnDef } from '@tanstack/react-table';
import WorkerPostsCountTable from '@/components/worker/worker-posts-count-table';

const actionColumn = getActionColumn(({ row }) => (
  <DepartmentWorkerTableRowAction id={row.original.id} name={row.original.name} />
))

const columns: ColumnDef<WorkersPostWorkerCount>[] = [
  nameColumn,
  postCountColumn,
  actionColumn,
]

type Props = {
  workers: WorkersPostWorkerCount[];
  button?: ReactNode;
}

export default function DepartmentWorkerTable({
  workers,
  button,
}: Readonly<Props>) {
  return (
    <WorkerPostsCountTable 
      data={workers}
      button={button}
      columns={columns}
    />
  )
}