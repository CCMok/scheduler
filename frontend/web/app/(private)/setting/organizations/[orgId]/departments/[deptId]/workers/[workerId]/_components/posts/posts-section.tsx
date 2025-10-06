import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import CustomCard from "@/components/_general/card/custom-card";
import { getPostWorkersCountService } from "@/libs/server/post/services/get-post-workers-count-service";
import { PostsPostWorkersCount } from "@/libs/server/post/models/post-dao";
import PostFilter from "@/components/post/post-filter";
import AssignPostDialog from "./assign/assign-post-dialog";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { Post } from "@/external/prisma-generated";
import WorkerPostTable from "./table/worker-post-table";
import { Suspense } from "react";
import TableCardSkeleton from "@/components/_general/skeleton/table-card-skeleton";

const getPostWorkersCount = async (workerId: number): Promise<PostsPostWorkersCount[]> => {
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

async function PostsSectionContent({
  workerId,
  departmentId,
}: Readonly<Props>) {
  const [workerPosts, departmentPosts] = await Promise.all([
    getPostWorkersCount(workerId),
    getDepartmentPosts(departmentId),
  ])

  const assignablePosts = departmentPosts.filter(post => !workerPosts.some(workerPost => workerPost.id === post.id));

  return (
    <CustomCard>
      <PostFilter button={<AssignPostDialog posts={assignablePosts} />} />
      <WorkerPostTable
        posts={workerPosts}
      />
    </CustomCard>
  )
}

export default function PostsSection({
  workerId,
  departmentId,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<TableCardSkeleton />}>
      <PostsSectionContent
        workerId={workerId}
        departmentId={departmentId}
      />
    </Suspense>
  )
}