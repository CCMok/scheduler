import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { notFound } from "next/navigation";
import QueryTabLayout from '@/components/_general/layout/setting/query-tab-layout';
import WorkersSection from "./_components/workers/workers-section";
import { PATH } from "@/libs/share/_general/utils/path";
import OrganizationName from "@/components/organization/organization-name";
import DepartmentName from "@/components/department/department-name";
import PostName from "@/components/post/post-name";
import UpdatePostNameSectionServer from "./_components/update-name/update-post-name-section-server";

type Props = ParamProps<{
  [Param.ORG_ID]: string;
  [Param.DEPT_ID]: string;
  [Param.POST_ID]: string;
}>

export default async function OrgDeptPostSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const postId = Number(awaitedParams.postId);
  if (isNaN(postId)) notFound();

  const deptId = Number(awaitedParams.deptId);
  if (isNaN(deptId)) notFound();

  const orgId = Number(awaitedParams.orgId);
  if (isNaN(orgId)) notFound();

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
          label: <OrganizationName id={orgId} failNotFound />,
          href: PATH.setting.organizations.build(orgId),
        },
        {
          key: 'department',
          label: <DepartmentName id={deptId} failNotFound />,
          href: PATH.setting.organizations.departments.build(orgId, deptId),
        },
        {
          key: 'post',
          label: <PostName id={postId} failNotFound />,
        },
      ]}
      tabs={[
        {
          value: 'info',
          label: '基本資料',
          content: <UpdatePostNameSectionServer id={postId} />,
        },
        {
          value: 'workers',
          label: '人員',
          content: <WorkersSection
            departmentId={deptId}
            postId={postId}
          />,
        },
      ]}
    />
  )
}