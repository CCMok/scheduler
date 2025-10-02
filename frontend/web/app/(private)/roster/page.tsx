import BreadcrumbHeaderLayout from "@/components/_general/layout/setting/breadcrumb-header-layout";
import RosterFilterSection from "./_components/filter/roster-filter-section";
import RosterTableSection from "./_components/table/roster-table-section";
import { ArrangeRosterStoreProvider } from "@/app/(private)/roster/_components/store/arrange-roster-store-provider";

export default async function RosterPage() {
  return (
    <BreadcrumbHeaderLayout current='值班表'>
      <ArrangeRosterStoreProvider>
        <RosterFilterSection />
        <RosterTableSection />
      </ArrangeRosterStoreProvider>
    </BreadcrumbHeaderLayout>
  )
}