import RosterFilterSection from "./_components/filter/roster-filter-section";
import RosterTableSection from "./_components/table/roster-table-section";
import { ArrangeRosterStoreProvider } from "@/app/(private)/roster/_components/store/arrange-roster-store-provider";
import ArrangeRosterStoreHandler from "./_components/store/arrange-roster-store-handler";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";

export default async function RosterPage() {
  return (
    <SidebarInsetLayout breadcrumbItems={[
      {
        key: 'roster',
        label: '值班表',
      },
    ]}>
      <ArrangeRosterStoreProvider>
        <ArrangeRosterStoreHandler />
        <RosterFilterSection />
        <RosterTableSection />
      </ArrangeRosterStoreProvider>
    </SidebarInsetLayout>
  )
}