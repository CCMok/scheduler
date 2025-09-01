import ManageTableSection from "@/components/table/manage-table-section";
import PostFilter from "./_components/post-filter";
import { SearchParamProps } from "@/libs/share/_general/props/param-props";
import { PostParam } from "./_components/post-param";
import { Param } from "@/libs/share/_general/enums/param";
import { toNumber } from "@/libs/share/_general/utils/number";

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

  return (
    <ManageTableSection
      title="職位管理"
      // TODO: table
      filter={<PostFilter orgId={orgId} />}
    />
  )
}