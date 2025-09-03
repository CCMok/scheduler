'use client'

import useTable from "@/components/table/use-table";
import { Post } from "@/external/prisma-generated";
import { PostIndividualTableId, columns } from "./post-individual-table-column";
import ButtonTable from "@/components/table/button-table";
import { ReactNode } from "react";

type Props = {
  posts: Post[];
  button?: ReactNode;
}

export default function PostIndividualTable({
  posts,
  button,
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
    <ButtonTable
      table={table}
      button={button}
    />
  )
}