import { getOrganizationsBySession } from "@/libs/server/organization/repositories/organization-repository";
import RosterFilterSection from "./_components/filter/roster-filter-section";
import RosterTableSection from "./_components/table/roster-table-section";
import { RosterStoreProvider } from "@/components/store/roster/roster-store-provider";
import ArrangeRosterForm from "./_components/form/arrange-roster-form";

export default async function RosterPage() {
  const organizations = await getOrganizationsBySession()

  return (
    <div className='h-full space-y-4'>
      <RosterStoreProvider initState={{ organizations }}>
        <ArrangeRosterForm>
          <RosterFilterSection />
          <RosterTableSection />
        </ArrangeRosterForm>
      </RosterStoreProvider>
    </div>
  )
}