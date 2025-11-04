import CustomCard from "@/components/_general/card/custom-card";
import PostConstraintTable from "./post-constraint-table";
import { getPostConstraintsWithChildService } from "@/libs/post-constraint/services/get-post-constraints-with-child-service";
import { redirect } from "next/navigation";
import { PostConstraintWithChild } from "@/libs/post-constraint/models/post-constraint-dao";
import { PostConstraintType, Post } from "@/external/prisma-generated";
import { getPostConstraintTypesService } from "@/libs/post-constraint/services/get-post-constraint-types-service";
import { getPostsService } from "@/libs/post/services/get-posts-service";
import CreatePostConstraintButton from "./create/create-post-constraint-button";
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getPostConstraints = async (departmentId: number): Promise<PostConstraintWithChild[]> => {
  const response = await getPostConstraintsWithChildService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}

const getPostConstraintTypes = async (): Promise<PostConstraintType[]> => {
  const response = await getPostConstraintTypesService()
  return handleGetResponse(response, redirect, [])
}

const getPosts = async (departmentId: number): Promise<Post[]> => {
  const response = await getPostsService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  departmentId: number;
}

async function PostConstraintSectionContent({
  departmentId,
}: Readonly<Props>) {
  const [postConstraints, postConstraintTypes, posts] = await Promise.all([
    getPostConstraints(departmentId),
    getPostConstraintTypes(),
    getPosts(departmentId),
  ])

  return (
    <>
      <div className='flex items-center justify-between'>
        <span className='font-semibold'>職位條件</span>
        <CreatePostConstraintButton
          postConstraintTypes={postConstraintTypes}
          posts={posts}
          departmentId={departmentId}
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
  departmentId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <Suspense fallback={<TableSkeleton />}>
        <PostConstraintSectionContent departmentId={departmentId} />
      </Suspense>
    </CustomCard>
  )
}