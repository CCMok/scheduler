import CreateRosterFilterServer from "../filter/create-roster-filter-server";
import CreateRosterStoreHandler from "../store/create-roster-store-handler";
import { CreateRosterStoreProvider } from "../store/create-roster-store-provider";
import RosterTableSection from "../table/roster-table-section";

export default function CreateRosterPageContent() {
  return (
    <CreateRosterStoreProvider initState={{ saveState: true }}>
      <CreateRosterStoreHandler />
      <div className="space-y-4">
        <CreateRosterFilterServer />
        <RosterTableSection />
      </div>
    </CreateRosterStoreProvider>
  )
}