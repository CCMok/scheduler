'use client'

import useTable from '@/components/_general/table/use-table';
import CustomTable from "@/components/_general/table/custom-table";
import { RosterHistoryRelated } from "@/libs/server/roster/models/roster-history-dao";
import { columns, RosterHistoryTableId } from "./roster-history-table-column";

type Props = {
  rosterHistories: RosterHistoryRelated[];
}

export default function RosterHistoryTable({
  rosterHistories,
}: Readonly<Props>) {
  // TODO
  // const searchParams = useSearchParams();
  // const name = searchParams.get(Param.NAME);

  const table = useTable({
    data: rosterHistories,
    columns,
    defaultSorting: [{
      id: RosterHistoryTableId.CREATED_AT,
      desc: true,
    }],
    // defaultColumnFilters: [
    //   ...(name ? [{ id: OrganizationTableId.NAME, value: name }] : []),
    // ],
  })

  // useEffect(() => {
  //   table.getColumn(OrganizationTableId.NAME)?.setFilterValue(name);
  // }, [name, table])

  return (
    <CustomTable
      table={table}
    />
  )
}