'use client'

import useTable from "@/components/_general/table/use-table";
import { PostConstraintWithChild } from "@/libs/server/post-constraint/models/post-constraint-dao";
import { getColumns, PostConstraintTableId } from "./post-constraint-table-column";
import CustomTable from "@/components/_general/table/custom-table";
import { PostConstraintType, Post } from "@/external/prisma-generated";

type Props = {
  postConstraints: PostConstraintWithChild[];
  postConstraintTypes: PostConstraintType[];
  posts: Post[];
}

export default function PostConstraintTable({
  postConstraints,
  postConstraintTypes,
  posts,
}: Readonly<Props>) {
  const columns = getColumns(postConstraintTypes, posts)

  const table = useTable({
    data: postConstraints,
    columns,
    defaultSorting: [{
      id: PostConstraintTableId.CONSTRAINT_TYPE,
      desc: false,
    }],
  })

  return (
    <CustomTable
      table={table}
    />
  )
}