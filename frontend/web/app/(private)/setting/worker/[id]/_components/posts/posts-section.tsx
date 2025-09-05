import { Post } from "@/external/prisma-generated";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { getWorkerPostsService } from "@/libs/server/worker/services/get-worker-posts-service";
import PostIndividualTable from "@/components/post/post-individual-table";
import CustomCard from "@/components/_general/card/custom-card";

const getPosts = async (workerId: number): Promise<Post[]> => {
  const postPosts = await fetchData(
    async () => await getWorkerPostsService({ id: workerId }),
    path => redirect(path),
    undefined,
  )

  if (!postPosts) return [];
  return postPosts.posts;
}

type Props = {
  workerId: number;
}

export default async function PostsSection({
  workerId,
}: Readonly<Props>) {
  const posts = await getPosts(workerId);

  return (
    <CustomCard title="職位">
      <PostIndividualTable posts={posts} />
    </CustomCard>
  )
}