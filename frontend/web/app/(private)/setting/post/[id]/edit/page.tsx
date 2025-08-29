import PostUpdateNameSection from "./_components/name/post-update-name-section";
import PostWorkerTableSection from "./_components/table/post-worker-table-section";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { notFound, redirect } from "next/navigation";
import { getPostWorkersService } from "@/libs/server/post/services/get-post-workers-service";
import { GetPostWorkersRequest } from "@/libs/server/post/models/get-post-workers-request";
import { PostWorkers } from "@/libs/server/post/models/post-dao";
import { PostUpdateStoreProvider } from "@/app/(private)/setting/post/[id]/edit/_components/store/post-update-store-provider";
import Header from "@/components/header/header";
import { PATH } from "@/libs/share/_general/utils/path";

const getPostWorkers = async (id: number): Promise<PostWorkers | undefined> => {
  const request: GetPostWorkersRequest = { id }

  return await fetchData(
    async () => getPostWorkersService(request),
    path => redirect(path),
    undefined,
  )
}

export default async function PostEditPage({
  params,
}: Readonly<ParamProps<{ [Param.ID]: string }>>) {
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  const postWorkers = await getPostWorkers(id);
  if (!postWorkers) notFound()

  return (
    <PostUpdateStoreProvider initState={{
      postId: id,
      postName: postWorkers.name,
      workers: postWorkers.workers,
      departmentId: postWorkers.departmentId,
    }}>
      <div className="space-y-4">
        <Header backPath={PATH.setting.posts}>
          <span>{postWorkers.name}</span>
        </Header>
        <PostUpdateNameSection />
        <PostWorkerTableSection />
      </div>
    </PostUpdateStoreProvider>
  )
}