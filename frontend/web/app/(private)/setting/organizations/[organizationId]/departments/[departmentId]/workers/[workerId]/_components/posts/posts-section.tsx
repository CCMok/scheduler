import { redirect } from "next/navigation";
import CustomCard from "@/components/_general/card/custom-card";
import { getPostsWithPostWorkersCountService } from "@/libs/post/services/get-posts-with-post-workers-count-service";
import { PostWithPostWorkersCount } from "@/libs/post/models/post-dao";
import PostFilter from "@/components/post/post-filter";
import AssignPostDialog from "./assign/assign-post-dialog";
import { getPostsService } from "@/libs/post/services/get-posts-service";
import { Post } from "@/external/prisma-generated";
import WorkerPostTable from "./table/worker-post-table";
import { Suspense } from "react";
import TableCardSkeleton from "@/components/_general/skeleton/table-card-skeleton";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getPostWorkersCount = async (workerId: number): Promise<PostWithPostWorkersCount[]> => {
  const response = await getPostsWithPostWorkersCountService(undefined, undefined, undefined, workerId)
  return handleGetResponse(response, redirect, [])
}

const getDepartmentPosts = async (departmentId: number): Promise<Post[]> => {
  const response = await getPostsService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
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