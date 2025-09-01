'use client'

import CustomTable from "@/components/table/custom-table";
import { getColumns, WorkerPostTableId } from "./worker-post-table-column";
import { useWorkerUpdateStore } from "../store/worker-update-store-provider";
import useTable from "@/components/table/use-table";

export default function WorkerPostTable() {
  const workerId = useWorkerUpdateStore(state => state.workerId)
  const workerName = useWorkerUpdateStore(state => state.workerName)
  const posts = useWorkerUpdateStore(state => state.posts)

  const table = useTable({
    data: posts,
    columns: getColumns(workerId, workerName),
    defaultSorting: [{
      id: WorkerPostTableId.NAME,
      desc: false,
    }],
  });

  return (
    <CustomTable table={table} />
  )
}