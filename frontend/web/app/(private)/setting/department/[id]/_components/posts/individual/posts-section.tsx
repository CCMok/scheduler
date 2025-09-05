import { Post } from "@/external/prisma-generated";
import PostIndividualTable from "@/components/post/post-individual-table";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import CreatePostButton from "./create/create-post-button";
import CustomCard from "@/components/_general/card/custom-card";

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
    <CustomCard title="職位">
      <PostIndividualTable
        posts={posts}
        button={<CreatePostButton deptId={deptId} />}
      />
    </CustomCard>
  )
}