import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import UpdateOrganizationNameForm from "./_components/update-organization-name-form";
import { redirect } from "next/navigation";
import { Organization } from "@/external/prisma-generated";
import { GetOrganizationsRequest } from "@/libs/server/organization/models/get-organizations-request";
import { fetchData } from "@/libs/share/_general/utils/fetch";

const getOrganizations = async (): Promise<Organization[]> => {
  const request: GetOrganizationsRequest = {
    orderBy: [{ field: 'name' }],
  }

  return await fetchData(
    async () => await getOrganizationsService(request),
    path => redirect(path)
  )
}

export default async function OrganizationSettingPage() {
  const organizations = await getOrganizations();

  return (
    <UpdateOrganizationNameForm organizations={organizations} />
  )
}