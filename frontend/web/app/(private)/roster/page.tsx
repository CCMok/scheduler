import { SearchParam } from "@/libs/share/_general/enums/param";
import RosterFilterSection from "./_components/filter/roster-filter-section";
import RosterTableSection from "./_components/table/roster-table-section";
import { ArrangeRosterStoreProvider } from "@/components/store/roster/arrange/arrange-roster-store-provider";
import { SearchParamProps } from "@/libs/share/_general/props/search-param-props";

type SearchParams = {
  [SearchParam.departmentId]?: string;
}

export default async function RosterPage({
  searchParams
}: Readonly<SearchParamProps<SearchParams>>) {
  const departmentId = (await searchParams)[SearchParam.departmentId]

  return (
    <div className='h-full space-y-4'>
      <ArrangeRosterStoreProvider>
        <RosterFilterSection departmentId={departmentId} />
        <RosterTableSection />
      </ArrangeRosterStoreProvider>
    </div>
  )
}