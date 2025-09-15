import { Param } from "@/libs/share/_general/enums/param"
import { ParamProps } from "@/libs/share/_general/props/param-props"
import IndividualSettingLayout from '@/components/_general/layout/setting/individual-setting-layout';
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { notFound, redirect } from "next/navigation";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";
import { PATH } from "@/libs/share/_general/utils/path";
import PostsSequenceSection from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/posts/sequence/posts-sequence-section";
import WorkersSection from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/workers/workers-section";
import UpdateDepartmentNameSection from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/update-name/update-department-name-section";
import PostsSection from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/posts/posts-section";
import { getDepartmentsOrganizationService } from "@/libs/server/department/services/get-departments-organization-service";
import ConfigSection from "./_components/config/config-section";

const getDepartment = async (id: number): Promise<DepartmentOrganization | undefined> => {
  const departments = await fetchData(
    async () => await getDepartmentsOrganizationService({
      where: { id },
    }),
    path => redirect(path),
    [],
  )
  return departments[0];
}

type Props = ParamProps<{
  [Param.ORG_ID]: string;
  [Param.DEPT_ID]: string;
}>

export default async function OrgDeptSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;
  const deptId = Number(awaitedParams.deptId);
  if (isNaN(deptId)) notFound();

  const department = await getDepartment(deptId);
  if (!department) notFound();

  return (
    <IndividualSettingLayout
      title={department.name}
      breadcrumbItems={[
        {
          label: '組織',
          href: PATH.setting.organizations.base,
        },
        {
          label: department.organization.name,
          href: PATH.setting.organizations.build(department.organization.id),
        },
      ]}
      tabs={[
        {
          value: 'info',
          label: '基本資料',
          content: <UpdateDepartmentNameSection department={department} />,
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