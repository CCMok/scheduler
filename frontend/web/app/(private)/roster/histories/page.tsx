import CustomCard from "@/components/_general/card/custom-card";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import RosterHistoryFilter from "./_components/filter/roster-history-filter";
import CreateRosterButton from "./_components/create/create-roster-button";
import RosterHistoryTable from "./_components/table/roster-history-table";
import { getRosterHistoriesWithRelatedService } from "@/libs/roster/services/get-roster-histories-with-related-service";
import { RosterHistoryWithRelated } from "@/libs/roster/models/roster-history-dao";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { redirect } from "next/navigation";

const getRosterHistories = async (): Promise<RosterHistoryWithRelated[]> => {
  const response = await getRosterHistoriesWithRelatedService()
  return handleGetResponse(response, redirect, [])
}

export default function RosterHistoryPage() {
  const rosterHistoriesPromise = getRosterHistories();

  return (
    <SidebarInsetLayout breadcrumbItems={[
      {
        key: 'roster',
        label: '值班表',
      },
      {
        key: 'histories',
        label: '紀錄',
      },
    ]}>
      <CustomCard>
        <Suspense>
          <RosterHistoryFilter button={<CreateRosterButton />} />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <RosterHistoryTable
            rosterHistoriesPromise={rosterHistoriesPromise}
          />
        </Suspense>
      </CustomCard>
    </SidebarInsetLayout>
  )
}