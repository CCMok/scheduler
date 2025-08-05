import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { ArrangeRosterFilterStoreProvider } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider";
import { getOrganizationsBySessionIncludeDepartments } from "@/libs/server/organization/repositories/organization-repository";
import ArrangeRosterForm from "../form/arrange-roster-form";

type Props = ClassNameProps

export default async function RosterFilterSection({
  className,
}: Readonly<Props>) {
  const organizations = await getOrganizationsBySessionIncludeDepartments()

  return (
    <section className={className}>
      <ArrangeRosterFilterStoreProvider initState={{ organizations }}>
        <ArrangeRosterForm />
      </ArrangeRosterFilterStoreProvider>
    </section>
  )
}