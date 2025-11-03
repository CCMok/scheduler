import { redirect } from "next/navigation";
import { getRosterHistoriesWithRelatedService } from "@/libs/server/roster/services/get-roster-histories-with-related-service";
import { RosterHistoryWithRelated } from "@/libs/server/roster/models/roster-history-dao";
import RosterHistoryTable from "./roster-history-table";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";

const getRosterHistories = async (): Promise<RosterHistoryWithRelated[]> => {
  const response = await getRosterHistoriesWithRelatedService()
  return handleGetResponse(response, redirect, [])
}

export default async function RosterHistoryTableServer() {
  const rosterHistories = await getRosterHistories();

  return (
    <RosterHistoryTable
      rosterHistories={rosterHistories}
    />
  )
}
