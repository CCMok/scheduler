'use client'

import useTable from '@/components/_general/table/use-table';
import { useEffect } from "react";
import { PostsPostWorkersCount } from '@/libs/server/post/models/post-dao';
import { isNil } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { Param } from '@/libs/share/_general/enums/param';
import { PostTableId } from '@/components/post/post-workers-count-table-column';
import { ColumnDef } from '@tanstack/react-table';
import CustomTable from '../_general/table/custom-table';

type Props = {
  data?: PostsPostWorkersCount[];
  columns?: ColumnDef<PostsPostWorkersCount>[];
}

export default function PostWorkersCountTable({
  data = [],
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
    <CustomTable
      table={table}
    />
  )
}