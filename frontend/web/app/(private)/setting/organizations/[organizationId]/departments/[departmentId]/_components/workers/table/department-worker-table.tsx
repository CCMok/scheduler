'use client'

import { WorkerWithPostWorkersCount } from "@/libs/worker/models/worker-dao";
import { getActionColumn, getNameColumn, postCountColumn } from '@/components/worker/workers-post-count-table-column';
import DepartmentWorkerTableRowAction from './department-worker-table-row-action';
import { ColumnDef } from '@tanstack/react-table';
import WorkerPostsCountTable from '@/components/worker/worker-posts-count-table';
import { use } from "react";

const actionColumn = getActionColumn(({ row }) => (
  <DepartmentWorkerTableRowAction
    id={row.original.id}
    name={row.original.name}
    departmentId={row.original.departmentId}
  />
))

const columns: ColumnDef<WorkerWithPostWorkersCount>[] = [
  getNameColumn(true),
  postCountColumn,
  actionColumn,
]

type Props = {
  workersPromise: Promise<WorkerWithPostWorkersCount[]>;
}

export default function DepartmentWorkerTable({
  workersPromise,
}: Readonly<Props>) {
  const workers = use(workersPromise);

  return (
    <WorkerPostsCountTable
      data={workers}
      columns={columns}
    />
  )
}