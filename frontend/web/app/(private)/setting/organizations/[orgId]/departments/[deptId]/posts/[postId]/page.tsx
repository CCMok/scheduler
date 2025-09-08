import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { notFound, redirect } from "next/navigation";
import IndividualSettingLayout from '@/components/_general/layout/setting/individual-setting-layout';
import { Post } from "@/external/prisma-generated";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import UpdatePostNameSection from "./_components/update-name/update-post-name-section";
import WorkersSection from "./_components/workers/workers-section";
import { PATH } from "@/libs/share/_general/utils/path";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { DepartmentRelate } from "@/libs/server/department/models/get-departments-request";

const getPost = async (id: number): Promise<Post | undefined> => {
  const posts = await fetchData(
    async () => await getPostsService({ where: { id } }),
    path => redirect(path),
    [],
  )

  return posts[0];
}

const getDepartment = async (deptId: number): Promise<DepartmentOrganization | undefined> => {
  const departments = await fetchData(
    async () => await getDepartmentsService<DepartmentOrganization>({ 
      where: { id: deptId },
      relate: [DepartmentRelate.ORGANIZATION],
    }),
    path => redirect(path),
    [],
  )
  return departments[0];
}

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
  const post = await getPost(postId);
  if (!post) notFound()

  const deptId = Number(awaitedParams.deptId);
  if (isNaN(deptId)) notFound();
  const department = await getDepartment(deptId);
  if (!department) notFound();

  return (
    <IndividualSettingLayout
      title={post.name}
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
          content: <UpdatePostNameSection post={post} />,
        },
        {
          value: 'workers',
          label: '人員',
          content: <WorkersSection postId={postId} />,
        },
      ]}
    />
  )
}