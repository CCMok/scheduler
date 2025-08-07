import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { ArrangeRosterFilterStoreProvider } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider";
import ArrangeRosterForm from "../form/arrange-roster-form";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-dao";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { redirect } from "next/navigation";
import { GetOrganizationsRequest, OrganizationRelate } from "@/libs/server/organization/models/get-organizations-request";

const getOrganizations = async (): Promise<OrganizationDepartments[]> => {
  const request: GetOrganizationsRequest = {
    relate: [OrganizationRelate.DEPARTMENT],
    orderBy: [
      { field: 'name' },
      { level: OrganizationRelate.DEPARTMENT, field: 'name' },
    ]
  }

  const response = await getOrganizationsService<OrganizationDepartments>(request)

  const uiResponse = handleServiceResponse(response, path => redirect(path))
  if (!uiResponse.isSuccess) {
    console.error('Failed to get organizations. message title: ', uiResponse.message.title, 'message content: ', uiResponse.message.content)
    return [];
  }

  return uiResponse.data
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