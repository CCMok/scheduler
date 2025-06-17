import { getOrganizationsBySession } from "@/libs/server/organization/repositories/organization-repository";
import RosterFilterSection from "./_components/filter/roster-filter-section";
import RosterTableSection from "./_components/table/roster-table-section";
import { RosterStoreProvider } from "@/components/store/roster/roster-store-provider";

export default async function RosterPage() {
  const organizations = await getOrganizationsBySession()

  return (
    <div className='h-full space-y-2'>
      <RosterStoreProvider initState={{ organizations }}>
        <RosterFilterSection />
        <RosterTableSection />
      </RosterStoreProvider>
    </div>
  )
}