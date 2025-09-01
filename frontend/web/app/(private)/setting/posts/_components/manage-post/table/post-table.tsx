'use client'

import { usePostSettingStore } from "@/app/(private)/setting/posts/_components/manage-post/store/post-setting-store-provider"
import { columns, PostTableId } from "./post-table-column";
import { useEffect } from "react";
import CustomTable from "@/components/table/custom-table";
import useTable from "@/components/table/use-table";

export default function PostTable() {
  const posts = usePostSettingStore(state => state.posts);
  const postNameFilter = usePostSettingStore(state => state.postNameFilter);

  const table = useTable({
    data: posts,
    columns,
    defaultSorting: [{
      id: PostTableId.NAME,
      desc: false,
    }],
  })

  useEffect(() => {
    table.getColumn('name')?.setFilterValue(postNameFilter);
  }, [postNameFilter, table])

  return (
    <CustomTable table={table} />
  )
}