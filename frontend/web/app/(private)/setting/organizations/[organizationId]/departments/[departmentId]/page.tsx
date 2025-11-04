import { Param } from "@/libs/_general/enums/param"
import { ParamProps } from "@/libs/_general/props/param-props"
import QueryTabLayout from '@/components/_general/layout/setting/query-tab-layout';
import { notFound } from "next/navigation";
import { PATH } from "@/libs/_general/enums/path";
import PostsSequenceSection from "@/app/(private)/setting/organizations/[organizationId]/departments/[departmentId]/_components/posts/sequence/posts-sequence-section";
import WorkersSection from "@/app/(private)/setting/organizations/[organizationId]/departments/[departmentId]/_components/workers/workers-section";
import PostsSection from "@/app/(private)/setting/organizations/[organizationId]/departments/[departmentId]/_components/posts/posts-section";
import ConfigSection from "./_components/config/config-section";
import OrganizationName from "@/components/organization/organization-name";
import UpdateDepartmentNameSectionServer from "./_components/update-name/update-department-name-section-server";
import DepartmentName from "@/components/department/department-name";

type Props = ParamProps<{
  [Param.ORGANIZATION_ID]: string;
  [Param.DEPARTMENT_ID]: string;
}>

export default async function OrganizationDepartmentSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const organizationId = Number.parseInt(awaitedParams[Param.ORGANIZATION_ID])
  const departmentId = Number.parseInt(awaitedParams[Param.DEPARTMENT_ID])

  if (Number.isNaN(organizationId) || Number.isNaN(departmentId)) notFound()

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
          label: <OrganizationName id={organizationId} failNotFound />,
          href: PATH.setting.organizations.build(organizationId),
        },
        {
          key: 'department',
          label: <DepartmentName id={departmentId} failNotFound />,
        },
      ]}
      tabs={[
        {
          value: 'info',
          label: '基本資料',
          content: <UpdateDepartmentNameSectionServer id={departmentId} />,
        },
        {
          value: 'posts',
          label: '職位',
          content: <PostsSection departmentId={departmentId} />,
        },
        {
          value: 'workers',
          label: '人員',
          content: <WorkersSection departmentId={departmentId} />,
        },
        {
          value: 'posts-sequence',
          label: '值班表職位順序',
          content: <PostsSequenceSection departmentId={departmentId} />,
        },
        {
          value: 'config',
          label: '編排配置',
          content: <ConfigSection departmentId={departmentId} />,
        },
      ]}
    />
  )
}