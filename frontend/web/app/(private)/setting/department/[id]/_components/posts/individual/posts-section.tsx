import { Post } from "@/external/prisma-generated";
import PostIndividualTable from "@/libs/client/post/components/post-individual-table";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import UpdateChildLayout from '@/components/_general/layout/update-child/update-child-layout';
import CreatePostButton from "./create/create-post-button";

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
      <PostIndividualTable
        posts={posts}
        button={<CreatePostButton deptId={deptId} />}
      />
    </UpdateChildLayout>
  )
}