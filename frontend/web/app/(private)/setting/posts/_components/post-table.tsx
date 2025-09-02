'use client'

import { useEffect } from "react";
import CustomTable from "@/components/table/custom-table";
import { useSearchParams } from "next/navigation";
import useTable from "@/components/table/use-table";
import { PostDeptOrg } from "@/libs/server/post/models/post-dao";
import { PostParam } from "./post-param";
import { columns, PostTableId } from "./post-table-column";

type Props = {
  posts: PostDeptOrg[];
}

export default function PostTable({
  posts,
}: Readonly<Props>) {
  const searchParams = useSearchParams();
  const name = searchParams.get(PostParam.NAME);

  const table = useTable({
    data: posts,
    columns,
    defaultSorting: [
      {
        id: PostTableId.ORGANIZATION_NAME,
        desc: false,
      },
      {
        id: PostTableId.DEPARTMENT_NAME,
        desc: false,
      },
    ],
    defaultColumnFilters: [{
      id: PostTableId.NAME,
      value: name ?? '',
    }],
  })

  useEffect(() => {
    table.getColumn(PostTableId.NAME)?.setFilterValue(name);
  }, [name, table])

  return (
    <CustomTable table={table} />
  )
}