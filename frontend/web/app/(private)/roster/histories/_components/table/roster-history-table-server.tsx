import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { getRosterHistoriesService } from "@/libs/server/roster/services/get-roster-histories-service";
import { RosterHistoryRelated } from "@/libs/server/roster/models/roster-history-dao";
import RosterHistoryTable from "./roster-history-table";

const getRosterHistories = async (): Promise<RosterHistoryRelated[]> => {
  return await fetchData(
    async () => await getRosterHistoriesService({}),
    path => redirect(path),
    [],
  )
}

export default async function RosterHistoryTableServer() {
  const rosterHistories = await getRosterHistories();

  return (
    <RosterHistoryTable
      rosterHistories={rosterHistories}
    />
  )
}
