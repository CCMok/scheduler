import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import RosterFilterForm from "./roster-filter-form";
import { getOrganizationsBySession } from "@/libs/server/organization/repositories/organization-repository";
import { RosterFilterStoreProvider } from "@/components/store/roster-filter/roster-filter-store-provider";

export default async function RosterFilterSection({
  className,
}: Readonly<ClassNameProps>) {
  const organizations = await getOrganizationsBySession()

  return (
    <section className={className}>
      <RosterFilterStoreProvider initState={{ organizations }}>
        <RosterFilterForm />
      </RosterFilterStoreProvider>
    </section>
  )
}