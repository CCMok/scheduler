import RosterSectionFilter from "./_components/filter/roster-section-filter";
import RosterSectionTable from "./_components/table/roster-section-table";

export default function RosterPage() {
  return (
    <>
      <RosterSectionFilter className='min-h-40' />
      <RosterSectionTable />
    </>
  )
}