'use client'

import useTable from "@/components/table/use-table";
import { Post } from "@/external/prisma-generated";
import { PostIndividualTableId, columns } from "./post-individual-table-column";
import CustomTable from "@/components/table/custom-table";

type Props = {
  posts: Post[];
}

export default function PostIndividualTable({
  posts,
}: Readonly<Props>) {
  const table = useTable({
    data: posts,
    columns,
    defaultSorting: [{
      id: PostIndividualTableId.NAME,
      desc: false,
    }],
  })
  
  return (
    <CustomTable table={table} />
  )
}