'use client'

import useTable from '@/components/_general/table/use-table';
import ButtonTable from '@/components/_general/table/button-table';
import { ReactNode, useEffect } from "react";
import { PostsPostWorkersCount } from '@/libs/server/post/models/post-dao';
import { isNil } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { Param } from '@/libs/share/_general/enums/param';
import { PostTableId } from '@/components/post/post-workers-count-table-column';
import { ColumnDef } from '@tanstack/react-table';

type Props = {
  data?: PostsPostWorkersCount[];
  button?: ReactNode;
  columns?: ColumnDef<PostsPostWorkersCount>[];
}

export default function PostWorkersCountTable({
  data = [],
  button,
  columns = [],
}: Readonly<Props>) {
  const table = useTable({
    data,
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