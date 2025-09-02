import ManageTableSection from "@/components/table/manage-table-section";
import PostFilter from "./_components/post-filter";
import { SearchParamProps } from "@/libs/share/_general/props/param-props";
import { PostParam } from "./_components/post-param";
import { Param } from "@/libs/share/_general/enums/param";
import { toNumber } from "@/libs/share/_general/utils/number";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { PostDeptOrg } from "@/libs/server/post/models/post-dao";
import { getPostsService } from "@/libs/server/post/services/get-posts-dept-org-service";
import { redirect } from "next/navigation";
import PostTable from "./_components/post-table";

const getPosts = async (deptId?: number, orgId?: number): Promise<PostDeptOrg[]> => {
  return await fetchData(
    async () => await getPostsService({
      where: { deptId, orgId },
    }),
    path => redirect(path),
    [],
  )
}

type Props = SearchParamProps<{
  [Param.ID]: string | undefined,
  [PostParam.ORGANIZATION_ID]: string | undefined,
  [PostParam.DEPARTMENT_ID]: string | undefined,
}>

export default async function PostsPage({
  searchParams,
}: Readonly<Props>) {
  const params = await searchParams;
  const orgId = toNumber(params.organizationId);
  const deptId = toNumber(params.departmentId);

  const posts = await getPosts(deptId, orgId);

  return (
    <ManageTableSection
      title="職位管理"
      filter={<PostFilter orgId={orgId} />}
      table={<PostTable posts={posts} />}
    />
  )
}