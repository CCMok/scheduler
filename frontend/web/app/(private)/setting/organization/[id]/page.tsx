import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import UpdateOrganizationNameSection from "./_components/update-name/update-organization-name-section";
import { notFound, redirect } from "next/navigation";
import { Organization } from "@/external/prisma-generated";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import IndividualSettingLayout from "@/components/layout/setting/individual-setting-layout";
import DepartmentsSection from "./_components/departments/departments-section";

const getOrganization = async (id: number): Promise<Organization | undefined> => {
  const organizations = await fetchData(
    async () => await getOrganizationsService({
      where: { id },
    }),
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
    <IndividualSettingLayout
      title={organization.name}
      updateNameSection={<UpdateOrganizationNameSection organization={organization} />}
      otherSection={<DepartmentsSection orgId={id} />}
    />
  )
}