import RosterFilterSection from "./_components/filter/roster-filter-section";
import RosterTableSection from "./_components/table/roster-table-section";
import { ArrangeRosterStoreProvider } from "@/app/(private)/roster/_components/store/arrange-roster-store-provider";

export default async function RosterPage() {
  return (
    <div className='h-full space-y-4'>
      <ArrangeRosterStoreProvider>
        <RosterFilterSection />
        <RosterTableSection />
      </ArrangeRosterStoreProvider>
    </div>
  )
}