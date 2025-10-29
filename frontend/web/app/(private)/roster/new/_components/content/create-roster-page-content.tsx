import CreateRosterTable from "../table/create-roster-table";
import CreateRosterFilterServer from "../filter/create-roster-filter-server";

export default  function CreateRosterPageContent() {
  return (
    <div className="space-y-4">
      <CreateRosterFilterServer />
      <CreateRosterTable />
    </div>
  )
}