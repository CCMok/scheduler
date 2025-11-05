'use client'

import { PostWithPostWorkersCount } from '@/libs/post/models/post-dao';
import PostWorkersCountTable from '@/components/post/post-workers-count-table';
import { ColumnDef } from "@tanstack/react-table";
import { getActionColumn, getNameColumn, workerCountColumn } from "@/components/post/post-workers-count-table-column";
import DepartmentPostTableRowAction from "./department-post-table-row-action";
import { use } from 'react';

const actionColumn = getActionColumn(({ row }) => (
  <DepartmentPostTableRowAction
    id={row.original.id}
    name={row.original.name}
    departmentId={row.original.departmentId}
  />
))

const columns: ColumnDef<PostWithPostWorkersCount>[] = [
  getNameColumn(true),
  workerCountColumn,
  actionColumn,
]

type Props = {
  postsPromise: Promise<PostWithPostWorkersCount[]>;
}

export default function DepartmentPostTable({
  postsPromise,
}: Readonly<Props>) {
  const posts = use(postsPromise);

  return (
    <PostWorkersCountTable
      data={posts}
      columns={columns}
    />
  )
}