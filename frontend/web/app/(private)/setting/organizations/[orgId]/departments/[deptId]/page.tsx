import { Param } from "@/libs/share/_general/enums/param"
import { ParamProps } from "@/libs/share/_general/props/param-props"
import IndividualSettingLayout from '@/components/_general/layout/setting/individual-setting-layout';
import { notFound } from "next/navigation";
import { PATH } from "@/libs/share/_general/utils/path";
import PostsSequenceSection from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/posts/sequence/posts-sequence-section";
import WorkersSection from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/workers/workers-section";
import PostsSection from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/posts/posts-section";
import ConfigSection from "./_components/config/config-section";
import OrganizationName from "@/components/organization/organization-name";
import UpdateDepartmentNameSectionServer from "./_components/update-name/update-department-name-section-server";
import DepartmentName from "@/components/department/department-name";

type Props = ParamProps<{
  [Param.ORG_ID]: string;
  [Param.DEPT_ID]: string;
}>

export default async function OrgDeptSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const orgId = Number(awaitedParams.orgId);
  if (isNaN(orgId)) notFound();

  const deptId = Number(awaitedParams.deptId);
  if (isNaN(deptId)) notFound();

  return (
    <IndividualSettingLayout
      title={<DepartmentName id={deptId} failNotFound />}
      breadcrumbItems={[
        {
          label: '組織',
          href: PATH.setting.organizations.base,
        },
        {
          label: <OrganizationName id={orgId} failNotFound />,
          href: PATH.setting.organizations.build(orgId),
        },
      ]}
      tabs={[
        {
          value: 'info',
          label: '基本資料',
          content: <UpdateDepartmentNameSectionServer id={deptId} />,
        },
        {
          value: 'posts',
          label: '職位',
          content: <PostsSection deptId={deptId} />,
        },
        {
          value: 'workers',
          label: '人員',
          content: <WorkersSection deptId={deptId} />,
        },
        {
          value: 'posts-sequence',
          label: '值班表職位順序',
          content: <PostsSequenceSection deptId={deptId} />,
        },
        {
          value: 'config',
          label: '編排配置',
          content: <ConfigSection deptId={deptId} />,
        },
      ]}
    />
  )
}