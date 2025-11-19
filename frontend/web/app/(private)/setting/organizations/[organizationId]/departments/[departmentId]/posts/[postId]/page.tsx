import { ParamProps } from "@/libs/_general/props/param-props";
import { Param } from "@/libs/_general/enums/param";
import { notFound, redirect } from "next/navigation";
import QueryTabLayout from '@/components/_general/layout/setting/query-tab-layout';
import WorkersSection from "./_components/workers/workers-section";
import { PATH } from "@/libs/_general/enums/path";
import OrganizationName from "@/components/organization/organization-name";
import DepartmentName from "@/components/department/department-name";
import PostName from "@/components/post/post-name";
import { Post } from "@/external/prisma-generated";
import { getPostsService } from "@/libs/post/services/get-posts-service";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import UpdatePostNameSection from "./_components/update-name/update-post-name-section";
import { Suspense } from "react";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";

const getPost = async (id: number): Promise<Post | undefined> => {
  const response = await getPostsService(id)
  const data = handleGetResponse(response, redirect, [])
  return data[0]
}

type Props = ParamProps<{
  [Param.ORGANIZATION_ID]: string;
  [Param.DEPARTMENT_ID]: string;
  [Param.POST_ID]: string;
}>

export default async function OrganizationDepartmentPostSettingPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const organizationId = Number.parseInt(awaitedParams[Param.ORGANIZATION_ID]);
  const departmentId = Number.parseInt(awaitedParams[Param.DEPARTMENT_ID]);
  const postId = Number.parseInt(awaitedParams[Param.POST_ID]);

  if (Number.isNaN(organizationId) || Number.isNaN(departmentId) || Number.isNaN(postId)) notFound();

  const postPromise = getPost(postId);

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
          key: 'post',
          label: <PostName id={postId} failNotFound />,
        },
      ]}
      tabs={[
        {
          value: 'workers',
          label: '人員',
          content: <WorkersSection
            departmentId={departmentId}
            postId={postId}
          />,
        },
        {
          value: 'info',
          label: '基本資料',
          content: (
            <Suspense fallback={<InputCardSkeleton />}>
              <UpdatePostNameSection postPromise={postPromise} />
            </Suspense>
          ),
        },
      ]}
    />
  )
}