import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { ArrangeRosterFilterStoreProvider } from "@/app/(private)/roster/_components/filter/store/arrange-roster-filter-store-provider";
import ArrangeRosterForm from "../form/arrange-roster-form";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-dao";
import { redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getOrganizationsDepartmentService } from "@/libs/server/organization/services/get-organizations-department-service";

const getOrganizations = async (): Promise<OrganizationDepartments[]> => {
  return await fetchData(
    async () => await getOrganizationsDepartmentService({
      orderBys: [{ field: 'name' }],
      department: {
        orderBys: [{ field: 'name' }]
      }
    }),
    path => redirect(path),
    [],
  )
}

type Props = ClassNameProps

export default async function RosterFilterSection({
  className,
}: Readonly<Props>) {
  const organizations = await getOrganizations();

  return (
    <section className={className}>
      <ArrangeRosterFilterStoreProvider initState={{ organizations }}>
        <ArrangeRosterForm />
      </ArrangeRosterFilterStoreProvider>
    </section>
  )
}