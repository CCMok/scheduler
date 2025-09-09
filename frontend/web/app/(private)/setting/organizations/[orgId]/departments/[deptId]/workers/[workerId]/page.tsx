import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { notFound, redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import IndividualSettingLayout from '@/components/_general/layout/setting/individual-setting-layout';
import { Worker } from "@/external/prisma-generated";
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";
import { PATH } from "@/libs/share/_general/utils/path";
import UpdateWorkerNameSection from "./_components/update-name/update-worker-name-section";
import PostsSection from "./_components/posts/posts-section";
import { getDepartmentsOrganizationService } from "@/libs/server/department/services/get-departments-organization-service";

const getWorkerPosts = async (id: number): Promise<Worker | undefined> => {
  const workers = await fetchData(
    async () => getWorkersService({ where: { id } }),
    path => redirect(path),
    [],
  )
  return workers[0]
}

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
  [Param.WORKER_ID]: string;
}>

export default async function WorkerSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const id = Number(awaitedParams.workerId);
  if (isNaN(id)) notFound();
  const worker = await getWorkerPosts(id);
  if (!worker) notFound()

  const deptId = Number(awaitedParams.deptId);
  if (isNaN(deptId)) notFound();
  const department = await getDepartment(deptId);
  if (!department) notFound();

  return (
    <IndividualSettingLayout
      title={worker.name}
      breadcrumbItems={[
        {
          label: '組織',
          href: PATH.setting.organizations.base,
        },
        {
          label: department.organization.name,
          href: PATH.setting.organizations.build(department.organization.id),
        },
        {
          label: department.name,
          href: PATH.setting.organizations.departments.build(department.organization.id, department.id),
        },
      ]}
      tabs={[
        {
          value: 'info',
          label: '基本資料',
          content: <UpdateWorkerNameSection worker={worker} />,
        },
        {
          value: 'posts',
          label: '職位',
          content: <PostsSection workerId={id} />,
        },
      ]}
    />
  )
}