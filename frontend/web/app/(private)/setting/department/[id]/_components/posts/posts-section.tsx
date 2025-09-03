import { Post } from "@/external/prisma-generated";
import PostTable from "./post-table";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import UpdateChildLayout from "@/components/layout/update-child/update-child-layout";

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

export default async function PostsSection({
  deptId,
}: Readonly<Props>) {
  const posts = await getPosts(deptId);

  return (
    <UpdateChildLayout childName="職位">
      <PostTable posts={posts} />
    </UpdateChildLayout>
  )
}