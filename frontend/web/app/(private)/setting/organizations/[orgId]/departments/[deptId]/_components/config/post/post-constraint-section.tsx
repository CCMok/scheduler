import CustomCard from "@/components/_general/card/custom-card";
import PostConstraintTable from "./post-constraint-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getPostConstraintPostsService } from "@/libs/server/post-constraint/services/get-post-constraints-posts-service";
import { redirect } from "next/navigation";
import { PostConstraintPosts } from "@/libs/server/post-constraint/models/post-constraint-dao";
import { PostConstraintType, Post } from "@/external/prisma-generated";
import { getPostConstraintTypesService } from "@/libs/server/post-constraint-type/services/get-post-constraint-types-service";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import CreatePostConstraintButton from "./create/create-post-constraint-button";
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";

const getPostConstraints = async (departmentId: number): Promise<PostConstraintPosts[]> => {
  return await fetchData(
    async () => getPostConstraintPostsService({
      where: { departmentId },
    }),
    path => redirect(path),
    [],
  )
}

const getPostConstraintTypes = async (): Promise<PostConstraintType[]> => {
  return await fetchData(
    async () => getPostConstraintTypesService({}),
    path => redirect(path),
    [],
  )
}

const getPosts = async (departmentId: number): Promise<Post[]> => {
  const response = await getPostsService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  deptId: number;
}

async function PostConstraintSectionContent({
  deptId,
}: Readonly<Props>) {
  const [postConstraints, postConstraintTypes, posts] = await Promise.all([
    getPostConstraints(deptId),
    getPostConstraintTypes(),
    getPosts(deptId),
  ])

  return (
    <>
      <div className='flex items-center justify-between'>
        <span className='font-semibold'>職位條件</span>
        <CreatePostConstraintButton
          postConstraintTypes={postConstraintTypes}
          posts={posts}
          departmentId={deptId}
        />
      </div>
      <PostConstraintTable
        postConstraints={postConstraints}
        postConstraintTypes={postConstraintTypes}
        posts={posts}
      />
    </>
  )
}

export default function PostConstraintSection({
  deptId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <Suspense fallback={<TableSkeleton />}>
        <PostConstraintSectionContent deptId={deptId} />
      </Suspense>
    </CustomCard>
  )
}