import CustomCard from "@/components/_general/card/custom-card";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import RosterHistoryTableServer from "./_components/table/roster-history-table-server";

export default function RosterHistoryPage() {
  return (
    <SidebarInsetLayout breadcrumbItems={[
      {
        key: 'roster',
        label: '值班表',
      },
      {
        key: 'history',
        label: '紀錄',
      },
    ]}>
      <CustomCard>
        {/* TODO */}
        {/* <OrganizationFilter button={<CreateOrganizationButton />} /> */}
        <Suspense fallback={<TableSkeleton />}>
          <RosterHistoryTableServer />
        </Suspense>
      </CustomCard>
    </SidebarInsetLayout>
  )
}