import { notFound, redirect } from "next/navigation";
import { ParamProps } from "@/libs/_general/props/param-props";
import { Param } from "@/libs/_general/enums/param";
import QueryTabLayout from '@/components/_general/layout/setting/query-tab-layout';
import DepartmentsSection from "./_components/departments/departments-section";
import { PATH } from "@/libs/_general/enums/path";
import OrganizationName from "@/components/organization/organization-name";
import { OrganizationPageTabId } from "./tab-id";
import { Suspense } from "react";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";
import UpdateOrganizationNameSection from "./_components/update-name/update-organization-name-section";
import { getOrganizationsService } from "@/libs/organization/services/get-organizations-service";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { Organization } from "@/external/prisma-generated";

const getOrganization = async (id: number): Promise<Organization | undefined> => {
  const response = await getOrganizationsService(id)
  const organizations = handleGetResponse(response, redirect, [])
  return organizations[0]
}

type Props = ParamProps<{ [Param.ORGANIZATION_ID]: string }>

export default async function OrganizationSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const id = Number.parseInt(awaitedParams[Param.ORGANIZATION_ID]);
  if (Number.isNaN(id)) notFound()

  const organizationPromise = getOrganization(id);

  return (
    <QueryTabLayout
      breadcrumbItems={[
        {
          key: 'setting',
          label: '設定',
        },
        {
          key: 'organizations',
          label: '機構',
          href: PATH.setting.organizations.base,
        },
        {
          key: 'organization',
          label: <OrganizationName id={id} failNotFound />,
        },
      ]}
      tabs={[
        {
          value: OrganizationPageTabId.DEPARTMENTS,
          label: '部門',
          content: <DepartmentsSection organizationId={id} />,
        },
        {
          value: OrganizationPageTabId.INFO,
          label: '基本資料',
          content: (
            <Suspense fallback={<InputCardSkeleton />}>
              <UpdateOrganizationNameSection organizationPromise={organizationPromise} />
            </Suspense>
          ),
        },
      ]}
    />
  )
}