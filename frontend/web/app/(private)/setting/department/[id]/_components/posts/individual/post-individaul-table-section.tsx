import { Post } from "@/external/prisma-generated";
import PostIndividualTable from "@/libs/client/post/components/post-individual-table";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import TableSectionLayout from "../table-section/table-section-layout";

const getPosts = async (deptId: number): Promise<Post[]> => {
  return await fetchData(
    async () => await getPostsService({ where: { departmentId: deptId } }),
    path => redirect(path),
    [],
  )
}

type Props = {
  deptId: number;
}

export default async function PostIndividualTableSection({
  deptId,
}: Readonly<Props>) {
  const posts = await getPosts(deptId);
  return (
    <TableSectionLayout title="職位列表">
      <PostIndividualTable posts={posts} />
    </TableSectionLayout>
  )
}