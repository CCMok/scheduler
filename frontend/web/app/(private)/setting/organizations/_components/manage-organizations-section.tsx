import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import OrganizationComboBox from "./organization-combo-box";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { Organization } from "@/external/prisma-generated";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import OrganizationTable from "./organization-table";

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
        <OrganizationComboBox organizations={organizations} />
        <OrganizationTable organizations={organizations} />
      </CardContent>
    </Card>
  )
}