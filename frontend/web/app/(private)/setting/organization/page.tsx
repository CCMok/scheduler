import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import UpdateOrganizationNameForm from "./_components/update-organization-name-form";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { redirect } from "next/navigation";
import { Organization } from "@/external/prisma-generated";
import { GetOrganizationsRequest } from "@/libs/server/organization/models/get-organizations-request";

const getOrganizations = async (): Promise<Organization[]> => {
  const request: GetOrganizationsRequest = {
    orderBy: [{ field: 'name' }],
  }

  const response = await getOrganizationsService(request)

  const uiResponse = handleServiceResponse(response, path => redirect(path))
  if (!uiResponse.isSuccess) {
    console.error('Failed to get organizations. message title: ', uiResponse.message.title, 'message content: ', uiResponse.message.content)
    return [];
  }

  return uiResponse.data
}

export default async function OrganizationSettingPage() {
  const organizations = await getOrganizations();

  return (
    <UpdateOrganizationNameForm organizations={organizations} />
  )
}