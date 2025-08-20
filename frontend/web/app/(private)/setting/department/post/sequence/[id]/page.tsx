import Header from "@/components/header/header";
import { Param } from "@/libs/share/_general/enums/param";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { PATH } from "@/libs/share/_general/utils/path";
import { notFound, redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request";
import { Post } from "@/external/prisma-generated";
import PostTable from "./_components/table/post-table";

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

export default async function PostSequencePage({
  params,
}: Readonly<ParamProps<{ [Param.ID]: string }>>) {  
  const paramId = (await params).id;
  const departmentId = Number(paramId);
  if (isNaN(departmentId)) notFound();

  const posts = await getPosts(departmentId);

  return (
    <div className="space-y-4">
      <Header backPath={PATH.setting.department.post.base}>
        <span>職位順序</span>
      </Header>
      <PostTable posts={posts} />
    </div>
  )
}