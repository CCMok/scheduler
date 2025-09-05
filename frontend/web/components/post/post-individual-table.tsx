'use client'

import useTable from '@/components/_general/table/use-table';
import { PostIndividualTableId, columns } from "./post-individual-table-column";
import ButtonTable from '@/components/_general/table/button-table';
import { ReactNode } from "react";
import { PostWorkersCount } from '@/libs/server/post/models/post-dao';

type Props = {
  posts: PostWorkersCount[];
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