import RosterFilterSection from "./_components/filter/roster-filter-section";
import RosterTableSection from "./_components/table/roster-table-section";

export default function RosterPage() {
  return (
    <div className='h-full space-y-2'>
      <RosterFilterSection />
      <RosterTableSection />
    </div>
  )
}