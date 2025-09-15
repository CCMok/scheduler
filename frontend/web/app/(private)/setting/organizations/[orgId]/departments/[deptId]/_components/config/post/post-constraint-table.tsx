'use client'

import useTable from "@/components/_general/table/use-table";
import { PostConstraintPosts } from "@/libs/server/post-constraint/models/post-constraint-dao";
import { getColumns, PostConstraintTableId } from "./post-constraint-table-column";
import CustomTable from "@/components/_general/table/custom-table";
import { PostConstraintType } from "@/external/prisma-generated";

type Props = {
  postConstraints: PostConstraintPosts[];
  postConstraintTypes: PostConstraintType[];
}

export default function PostConstraintTable({
  postConstraints,
  postConstraintTypes,
}: Readonly<Props>) {
  const columns = getColumns(postConstraintTypes)

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