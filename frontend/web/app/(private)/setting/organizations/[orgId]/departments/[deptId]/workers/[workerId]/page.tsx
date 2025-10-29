import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { notFound } from "next/navigation";
import QueryTabLayout from '@/components/_general/layout/setting/query-tab-layout';
import { PATH } from "@/libs/share/_general/utils/path";
import PostsSection from "./_components/posts/posts-section";
import DepartmentName from "@/components/department/department-name";
import OrganizationName from "@/components/organization/organization-name";
import WorkerName from "@/components/worker/worker-name";
import UpdateWorkerNameSectionServer from "./_components/update-name/update-worker-name-section-server";


type Props = ParamProps<{
  [Param.ORG_ID]: string;
  [Param.DEPT_ID]: string;
  [Param.WORKER_ID]: string;
}>

export default async function WorkerSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const workerId = Number(awaitedParams.workerId);
  if (isNaN(workerId)) notFound();

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
          key: 'worker',
          label: <WorkerName id={workerId} failNotFound />,
        },
      ]}
      tabs={[
        {
          value: 'info',
          label: '基本資料',
          content: <UpdateWorkerNameSectionServer id={workerId} />,
        },
        {
          value: 'posts',
          label: '職位',
          content: <PostsSection
            departmentId={deptId}
            workerId={workerId}
          />,
        },
      ]}
    />
  )
}