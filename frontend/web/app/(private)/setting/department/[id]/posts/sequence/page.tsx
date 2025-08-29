import Header from "@/components/header/header";
import { Param } from "@/libs/share/_general/enums/param";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { notFound, redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request";
import { Post } from "@/external/prisma-generated";
import PostSequenceTable from "./_components/table/post-sequence-table";
import PostSaveButton from "./_components/save-button/post-sequence-save-button";
import { PostSequenceStoreProvider } from "@/app/(private)/setting/department/[id]/posts/sequence/_components/store/post-sequence-store-provider";

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

export default async function PostsSequencePage({
  params,
}: Readonly<ParamProps<{ [Param.ID]: string }>>) {
  const paramId = (await params).id;
  const departmentId = Number(paramId);
  if (isNaN(departmentId)) notFound();

  const posts = await getPosts(departmentId);

  return (
    <PostSequenceStoreProvider initState={{
      posts,
    }}>
      <div className="space-y-4">
        <Header>
          <span>值班表職位順序</span>
        </Header>
        <PostSequenceTable />
        <div className='flex justify-end'>
          <PostSaveButton />
        </div>
      </div>
    </PostSequenceStoreProvider>
  )
}