import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { ArrangeRosterFilterStoreProvider } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider";
import { getOrganizationsBySessionIncludeWorkers } from "@/libs/server/organization/repositories/organization-repository";
import ArrangeRosterForm from "../form/arrange-roster-form";

export default async function RosterFilterSection({
  className,
}: Readonly<ClassNameProps>) {
  const organizations = await getOrganizationsBySessionIncludeWorkers()

  return (
    <section className={className}>
      <ArrangeRosterFilterStoreProvider initState={{ organizations }}>
        <ArrangeRosterForm />
      </ArrangeRosterFilterStoreProvider>
    </section>
  )
}