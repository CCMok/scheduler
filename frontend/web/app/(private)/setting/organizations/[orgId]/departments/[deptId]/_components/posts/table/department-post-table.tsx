'use client'

import { ReactNode } from "react";
import { PostsPostWorkersCount } from '@/libs/server/post/models/post-dao';
import PostWorkersCountTable from '@/components/post/post-workers-count-table';
import { ColumnDef } from "@tanstack/react-table";
import { getActionColumn, nameColumn, workerCountColumn } from "@/components/post/post-workers-count-table-column";
import DepartmentPostTableRowAction from "./department-post-table-row-action";

const actionColumn = getActionColumn(({ row }) => (
  <DepartmentPostTableRowAction id={row.original.id} name={row.original.name} />
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

export default function DepartmentPostTable({
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