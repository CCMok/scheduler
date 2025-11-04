import { notFound } from "next/navigation";
import { ParamProps } from "@/libs/_general/props/param-props";
import { Param } from "@/libs/_general/enums/param";
import QueryTabLayout from '@/components/_general/layout/setting/query-tab-layout';
import DepartmentsSection from "./_components/departments/departments-section";
import { PATH } from "@/libs/_general/enums/path";
import OrganizationName from "@/components/organization/organization-name";
import UpdateOrganizationNameSectionServer from "./_components/update-name/update-organization-name-section-server";
import { OrganizationPageTabId } from "./tab-id";

type Props = ParamProps<{ [Param.ORGANIZATION_ID]: string }>

export default async function OrganizationSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const id = Number.parseInt(awaitedParams[Param.ORGANIZATION_ID]);
  if (Number.isNaN(id)) notFound()

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
          value: OrganizationPageTabId.INFO,
          label: '基本資料',
          content: <UpdateOrganizationNameSectionServer id={id} />,
        },
        {
          value: OrganizationPageTabId.DEPARTMENTS,
          label: '部門',
          content: <DepartmentsSection organizationId={id} />,
        },
      ]}
    />
  )
}