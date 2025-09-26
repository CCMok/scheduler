import CustomCard from "@/components/_general/card/custom-card";
import PostConstraintTable from "./post-constraint-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getPostConstraintPostsService } from "@/libs/server/post-constraint/services/get-post-constraints-post-service";
import { redirect } from "next/navigation";
import { PostConstraintPosts } from "@/libs/server/post-constraint/models/post-constraint-dao";
import { PostConstraintType, Post } from "@/external/prisma-generated";
import { getPostConstraintTypesService } from "@/libs/server/post-constraint-type/services/get-post-constraint-types-service";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import CreatePostConstraintButton from "./create/create-post-constraint-button";

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
  return await fetchData(
    async () => getPostsService({
      where: { departmentId },
      orderBys: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  deptId: number;
}

export default async function PostConstraintSection({
  deptId,
}: Readonly<Props>) {
  const postConstraints = await getPostConstraints(deptId);
  const postConstraintTypes = await getPostConstraintTypes();
  const posts = await getPosts(deptId);

  return (
    <CustomCard>
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
    </CustomCard>
  )
}