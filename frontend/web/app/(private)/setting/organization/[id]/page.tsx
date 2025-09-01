import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import UpdateOrganizationNameSection from "./_components/update-name/organization-update-name-section";
import { notFound, redirect } from "next/navigation";
import { Organization } from "@/external/prisma-generated";
import { GetOrganizationsRequest } from "@/libs/server/organization/models/get-organizations-request";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import DepartmentsSection from "./_components/departments/departments-section";
import Header from "@/components/header/header";

const getOrganization = async (id: number): Promise<Organization | undefined> => {
  const request: GetOrganizationsRequest = {
    where: { id },
  }

  const organizations = await fetchData(
    async () => await getOrganizationsService(request),
    path => redirect(path),
    [],
  )

  return organizations[0];
}

type Props = ParamProps<{ [Param.ID]: string }>

export default async function OrganizationSettingPage({
  params,
}: Readonly<Props>) {
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  const organization = await getOrganization(id);
  if (!organization) notFound();

  return (
    <div className='space-y-4'>
      <Header>
        <span>{organization.name}</span>
      </Header>
      <UpdateOrganizationNameSection organization={organization} />
      <DepartmentsSection orgId={id} />
    </div>
  )
}