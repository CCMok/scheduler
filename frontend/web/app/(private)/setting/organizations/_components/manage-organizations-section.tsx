import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { Organization } from "@/external/prisma-generated";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import OrganizationTable from "./organization-table";
import OrganizationQueryComboBox from "@/libs/client/organization/components/organization-query-combo-box";
import { Param } from "@/libs/share/_general/enums/param";
import { PATH } from "@/libs/share/_general/utils/path";

const getOrganizations = async (): Promise<Organization[]> => {
  return await fetchData(
    async () => await getOrganizationsService({
      orderBy: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
}

export default async function ManageOrganizationsSection() {
  const organizations = await getOrganizations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>組織管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrganizationQueryComboBox
          organizations={organizations}
          paramName={Param.ID}
          path={PATH.setting.organizations}
        />
        <OrganizationTable organizations={organizations} />
      </CardContent>
    </Card>
  )
}