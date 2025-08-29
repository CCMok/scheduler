import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { redirect } from "next/navigation";
import { Organization } from "@/external/prisma-generated";
import { GetOrganizationsRequest } from "@/libs/server/organization/models/get-organizations-request";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { PATH } from "@/libs/share/_general/utils/path";

const getOrganizations = async (): Promise<Organization[]> => {
  const request: GetOrganizationsRequest = {
    orderBy: [{ field: 'name' }],
  }

  return await fetchData(
    async () => await getOrganizationsService(request),
    path => redirect(path),
    [],
  )
}

export default async function OrganizationSettingPage() {
  const organizations = await getOrganizations();
  if (organizations.length) redirect(PATH.setting.organizationNew.build(organizations[0].id))

  return (
    <div>
      <p>還沒有組織，請聯絡管理員。</p>
    </div>
  )
}