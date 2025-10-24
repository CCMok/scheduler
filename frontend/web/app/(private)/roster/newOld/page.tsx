import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import { ArrangeRosterStoreProvider } from "./_components/store/arrange-roster-store-provider";
import ArrangeRosterStoreHandler from "./_components/store/arrange-roster-store-handler";
import RosterFilterSection from "./_components/filter/roster-filter-section";
import RosterTableSection from "./_components/table/roster-table-section";

export default async function RosterNewPage() {
  return (
    <SidebarInsetLayout breadcrumbItems={[
      {
        key: 'roster',
        label: '值班表',
      },
      {
        key: 'new',
        label: '編排',
      },
    ]}>
      <ArrangeRosterStoreProvider initState={{ saveState: true }}>
        <ArrangeRosterStoreHandler />
        <div className="space-y-4">
          <RosterFilterSection />
          <RosterTableSection />
        </div>
      </ArrangeRosterStoreProvider>
    </SidebarInsetLayout>
  )
}