import BackHeader from "@/components/header/back-header";
import { Param } from "@/libs/share/_general/enums/param";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { notFound, redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request";
import { Department, Post } from "@/external/prisma-generated";
import PostSequenceTable from "./_components/table/post-sequence-table";
import PostSaveButton from "./_components/save-button/post-sequence-save-button";
import { PostSequenceStoreProvider } from "@/app/(private)/setting/department/[id]/posts/sequence/_components/store/post-sequence-store-provider";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";

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

type Props = ParamProps<{ [Param.ID]: string }>

export default async function PostsSequencePage({
  params,
}: Readonly<Props>) {
  const paramId = (await params).id;
  const departmentId = Number(paramId);
  if (isNaN(departmentId)) notFound();

  const posts = await getPosts(departmentId);

  const department = await getDepartment(departmentId);
  if (!department) notFound();

  return (
    <PostSequenceStoreProvider initState={{
      posts,
    }}>
      <div className="space-y-4">
        <BackHeader>
          <span>{department.name}</span>
        </BackHeader>
        <h1 className='text-lg font-bold'>值班表職位順序</h1>
        <PostSequenceTable />
        <div className='flex justify-end'>
          <PostSaveButton />
        </div>
      </div>
    </PostSequenceStoreProvider>
  )
}