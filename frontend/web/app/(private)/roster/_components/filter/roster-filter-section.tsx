import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import RosterFilterForm from "./roster-filter-form";
import { getOrganizationsBySession } from "@/libs/server/organization/repositories/organization-repository";
import { RosterFilterStoreProvider } from "@/components/store/roster-filter/roster-filter-store-provider";
import { getDefaultOrganizationId, getDepartments } from "./roster-filter-form-utils";

export default async function RosterFilterSection({
  className,
}: Readonly<ClassNameProps>) {
  const organizations = await getOrganizationsBySession()
  const defaultOrganizationId = getDefaultOrganizationId(organizations)
  const departments = getDepartments(organizations, defaultOrganizationId)

  return (
    <section className={className}>
      <RosterFilterStoreProvider initState={{ organizations, departments }}>
        <RosterFilterForm />
      </RosterFilterStoreProvider>
    </section>
  )
}