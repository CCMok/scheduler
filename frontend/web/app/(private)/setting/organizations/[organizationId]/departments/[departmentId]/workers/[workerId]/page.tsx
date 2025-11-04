import { ParamProps } from "@/libs/_general/props/param-props";
import { Param } from "@/libs/_general/enums/param";
import { notFound } from "next/navigation";
import QueryTabLayout from '@/components/_general/layout/setting/query-tab-layout';
import { PATH } from "@/libs/_general/enums/path";
import PostsSection from "./_components/posts/posts-section";
import DepartmentName from "@/components/department/department-name";
import OrganizationName from "@/components/organization/organization-name";
import WorkerName from "@/components/worker/worker-name";
import UpdateWorkerNameSectionServer from "./_components/update-name/update-worker-name-section-server";


type Props = ParamProps<{
  [Param.ORGANIZATION_ID]: string;
  [Param.DEPARTMENT_ID]: string;
  [Param.WORKER_ID]: string;
}>

export default async function WorkerSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const workerId = Number(awaitedParams[Param.WORKER_ID]);
  if (isNaN(workerId)) notFound();

  const departmentId = Number(awaitedParams[Param.DEPARTMENT_ID]);
  if (isNaN(departmentId)) notFound();

  const organizationId = Number(awaitedParams[Param.ORGANIZATION_ID]);
  if (isNaN(organizationId)) notFound();

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
          href: PATH.setting.organizations.departments.build(organizationId, departmentId),
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
            departmentId={departmentId}
            workerId={workerId}
          />,
        },
      ]}
    />
  )
}