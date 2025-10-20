import CustomCard from "@/components/_general/card/custom-card";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import RosterHistoryTableServer from "./_components/table/roster-history-table-server";
import RosterHistoryFilter from "./_components/filter/roster-history-filter";
import CreateRosterButton from "./_components/create/create-roster-button";

export default function RosterHistoryPage() {
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
          <RosterHistoryTableServer />
        </Suspense>
      </CustomCard>
    </SidebarInsetLayout>
  )
}