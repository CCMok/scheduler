'use client'

import { useWorkerSettingStore } from "@/app/(private)/setting/workers/_components/manage-worker/store/worker-setting-store-provider"
import { columns, WorkerTableId } from "./worker-table-column";
import { useEffect } from "react";
import CustomTable from "@/components/table/custom-table";
import useTable from "@/components/table/use-table";

export default function WorkerTable() {
  const workers = useWorkerSettingStore(state => state.workers);
  const workerNameFilter = useWorkerSettingStore(state => state.workerNameFilter);

  const table = useTable({
    data: workers,
    columns,
    defaultSorting: [{
      id: WorkerTableId.NAME,
      desc: false,
    }],
  })

  useEffect(() => {
    table.getColumn('name')?.setFilterValue(workerNameFilter);
  }, [workerNameFilter, table])

  return (
    <CustomTable table={table} />
  )
}