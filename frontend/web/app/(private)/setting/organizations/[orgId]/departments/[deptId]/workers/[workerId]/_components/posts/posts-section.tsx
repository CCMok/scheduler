import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import CustomCard from "@/components/_general/card/custom-card";
import { getPostWorkersCountService } from "@/libs/server/post/services/get-post-workers-count-service";
import { PostWorkersCount } from "@/libs/server/post/models/post-dao";
import PostFilter from "@/components/post/post-filter";
import AssignPostDialog from "./assign/assign-post-dialog";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { Post } from "@/external/prisma-generated";
import PostTable from "./table/post-table";

const getPostWorkersCount = async (workerId: number): Promise<PostWorkersCount[]> => {
  return await fetchData(
    async () => await getPostWorkersCountService({
      where: { workerId },
    }),
    path => redirect(path),
    [],
  )
}

const getDepartmentPosts = async (departmentId: number): Promise<Post[]> => {
  return await fetchData(
    async () => await getPostsService({
      where: { departmentId },
      orderBys: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  workerId: number;
  departmentId: number;
}

export default async function PostsSection({
  workerId,
  departmentId,
}: Readonly<Props>) {
  const workerPosts = await getPostWorkersCount(workerId);
  const departmentPosts = await getDepartmentPosts(departmentId);

  const assignablePosts = departmentPosts.filter(post => !workerPosts.some(workerPost => workerPost.id === post.id));

  return (
    <CustomCard title="職位">
      <PostFilter />
      <PostTable
        posts={workerPosts}
        button={<AssignPostDialog posts={assignablePosts} />}
      />
    </CustomCard>
  )
}