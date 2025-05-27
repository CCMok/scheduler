import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import RosterFilterForm from "./roster-filter-form";
import { getOrganizationsBySession } from "@/libs/server/organization/utils/organization-utils";
import { RosterFilterStoreProvider } from "@/components/store/roster-filter/roster-filter-store-provider";

export default async function RosterSectionFilter({
  className,
}: Readonly<ClassNameProps>) {
  const organizationDepartments = await getOrganizationsBySession(true)

  return (
    <section className={className}>
      <RosterFilterStoreProvider initState={{ organizationDepartments }}>
        <RosterFilterForm />
      </RosterFilterStoreProvider>
    </section>
  )
}