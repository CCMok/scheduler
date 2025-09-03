'use client'

import useTable from "@/components/table/use-table";
import { Post } from "@/external/prisma-generated";
import { PostTableId, columns } from "./post-table-column";
import CustomTable from "@/components/table/custom-table";

type Props = {
  posts: Post[];
}

export default function PostTable({
  posts,
}: Readonly<Props>) {
  const table = useTable({
    data: posts,
    columns,
    defaultSorting: [{
      id: PostTableId.NAME,
      desc: false,
    }],
  })
  
  return (
    <CustomTable table={table} />
  )
}