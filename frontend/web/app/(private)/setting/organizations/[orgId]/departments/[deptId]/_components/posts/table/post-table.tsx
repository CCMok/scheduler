'use client'

import useTable from '@/components/_general/table/use-table';
import { PostTableId, columns } from "./post-table-column";
import ButtonTable from '@/components/_general/table/button-table';
import { ReactNode, useEffect } from "react";
import { PostWorkersCount } from '@/libs/server/post/models/post-dao';
import { isNil } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { Param } from '@/libs/share/_general/enums/param';

type Props = {
  posts: PostWorkersCount[];
  button?: ReactNode;
}

export default function PostTable({
  posts,
  button,
}: Readonly<Props>) {
  const table = useTable({
    data: posts,
    columns,
    defaultSorting: [{
      id: PostTableId.NAME,
      desc: false,
    }],
  })

  const searchParams = useSearchParams();
  const name = searchParams.get(Param.NAME);

  useEffect(() => {
    if (!isNil(name)) {
      table.getColumn(PostTableId.NAME)?.setFilterValue(name);
    }
  }, [name, table])

  return (
    <ButtonTable
      table={table}
      button={button}
    />
  )
}