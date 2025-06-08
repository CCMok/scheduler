import RosterFilterSection from "./_components/filter/roster-filter-section";
import RosterPageProvider from "./_components/provider/roster-page-provider";
import RosterTableSection from "./_components/table/roster-table-section";

export default function RosterPage() {
  return (
    <div className='h-full space-y-2'>
      <RosterPageProvider>
        <RosterFilterSection />
        <RosterTableSection />
      </RosterPageProvider>
    </div>
  )
}