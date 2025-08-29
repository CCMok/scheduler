import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import UpdateOrganizationNameForm from "./_components/update-organization-name-form";
import { notFound, redirect } from "next/navigation";
import { Organization } from "@/external/prisma-generated";
import { GetOrganizationsRequest } from "@/libs/server/organization/models/get-organizations-request";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import OrganizationComboBox from "./_components/organization-combo-box";
import { Separator } from "@/external/shadcn/components/ui/separator";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";

const getOrganization = async (): Promise<Organization[]> => {
  const request: GetOrganizationsRequest = {
    orderBy: [{ field: 'name' }],
  }

  return await fetchData(
    async () => await getOrganizationsService(request),
    path => redirect(path),
    [],
  )
}

export default async function OrganizationSettingPage({
  params,
}: Readonly<ParamProps<{ [Param.ID]: string }>>) {
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  const organizations = await getOrganization();
  const currentOrg = organizations.find(org => org.id === id);
  if (!currentOrg) notFound();

  return (
    <div className='space-y-4'>
      <OrganizationComboBox
        organizations={organizations}
        currentOrgId={id}
      />
      <Separator />
      <UpdateOrganizationNameForm organization={currentOrg} />
    </div>
  )
}