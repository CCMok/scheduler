import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import RosterFilterForm from "./roster-filter-form";
import { getOrganizationsBySession } from "@/libs/server/organization/utils/organization-utils";

export default async function RosterSectionFilter({
  className,
}: Readonly<ClassNameProps>) {
  const organizationDepartments = await getOrganizationsBySession(true)

  return (
    <section className={className}>
      <RosterFilterForm organizationDepartments={organizationDepartments} />
    </section>
  )
}