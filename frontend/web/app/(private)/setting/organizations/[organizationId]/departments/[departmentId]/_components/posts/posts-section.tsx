import CreatePostButton from "./create/create-post-button";
import CustomCard from "@/components/_general/card/custom-card";
import PostFilter from "@/components/post/post-filter";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import DepartmentPostTable from "./table/department-post-table";
import { getPostsWithPostWorkersCountService } from "@/libs/post/services/get-posts-with-post-workers-count-service";
import { PostWithPostWorkersCount } from "@/libs/post/models/post-dao";
import { redirect } from "next/navigation";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getPostWorkersCount = async (departmentId: number): Promise<PostWithPostWorkersCount[]> => {
  const response = await getPostsWithPostWorkersCountService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  departmentId: number;
}

export default function PostsSection({
  departmentId,
}: Readonly<Props>) {
  const postsPromise = getPostWorkersCount(departmentId);

  return (
    <CustomCard>
      <PostFilter button={<CreatePostButton departmentId={departmentId} />} />
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentPostTable
          postsPromise={postsPromise}
        />
      </Suspense>
    </CustomCard>
  )
}