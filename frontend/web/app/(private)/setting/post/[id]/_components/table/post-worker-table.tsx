'use client'

import CustomTable from "@/components/table/custom-table";
import { getColumns, PostWorkerTableId } from "./post-worker-table-column";
import { usePostUpdateStore } from "../store/post-update-store-provider";
import useTable from "@/components/table/use-table";

export default function PostWorkerTable() {
  const postId = usePostUpdateStore(state => state.postId)
  const postName = usePostUpdateStore(state => state.postName)
  const workers = usePostUpdateStore(state => state.workers)

  const columns = getColumns(postId, postName);

  const table = useTable({
    data: workers,
    columns,
    defaultSorting: [{
      id: PostWorkerTableId.NAME,
      desc: false,
    }],
  })

  return (
    <CustomTable table={table} />
  )
}