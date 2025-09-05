import { notFound, redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request";
import { Department, Post } from "@/external/prisma-generated";
import PostSequenceTable from "./table/post-sequence-table";
import PostSaveButton from "./save-button/post-sequence-save-button";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { PostSequenceStoreProvider } from "./store/post-sequence-store-provider";
import CustomCard from "@/components/_general/card/custom-card";

const getPosts = async (departmentId: number): Promise<Post[]> => {
  const request: GetPostsRequest = {
    where: { departmentId },
    orderBy: [{ field: 'displayPosition' }],
  }

  return await fetchData(
    async () => getPostsService(request),
    path => redirect(path),
    [],
  )
}

const getDepartment = async (departmentId: number): Promise<Department> => {
  const departments = await fetchData(
    async () => await getDepartmentsService({
      where: { id: departmentId },
    }),
    path => redirect(path),
    [],
  )

  return departments[0];
}

type Props = {
  deptId: number;
}

export default async function PostsSequenceSection({
  deptId,
}: Readonly<Props>) {
  const posts = await getPosts(deptId);

  const department = await getDepartment(deptId);
  if (!department) notFound();

  return (
    <PostSequenceStoreProvider initState={{
      posts,
    }}>
      <CustomCard title="值班表職位順序">
        <PostSequenceTable />
        <div className='flex justify-end'>
          <PostSaveButton />
        </div>
      </CustomCard>
    </PostSequenceStoreProvider>
  )
}