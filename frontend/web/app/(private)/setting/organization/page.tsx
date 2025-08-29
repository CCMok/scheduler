import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { redirect } from "next/navigation";
import { Organization } from "@/external/prisma-generated";
import { GetOrganizationsRequest } from "@/libs/server/organization/models/get-organizations-request";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { PATH } from "@/libs/share/_general/utils/path";

const getFirstOrganization = async (): Promise<Organization | undefined> => {
  const request: GetOrganizationsRequest = {
    orderBy: [{ field: 'name' }],
    take: 1,
  }

  const orgs = await fetchData(
    async () => await getOrganizationsService(request),
    path => redirect(path),
    [],
  )

  return orgs[0];
}

export default async function OrganizationSettingPage() {
  const org = await getFirstOrganization();
  if (org) redirect(PATH.setting.organization.build(org.id))

  return (
    <div>
      <p>還沒有組織，請聯絡管理員。</p>
    </div>
  )
}