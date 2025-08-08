import PostUpdateHeader from "./_components/post-update-header";
import PostUpdateNameSection from "./_components/name/post-update-name-section";
import PostWorkerTableSection from "./_components/table/post-worker-table-section";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { notFound, redirect } from "next/navigation";
import { getPostWorkersService } from "@/libs/server/post/services/get-post-workers-service";
import { GetPostWorkersRequest } from "@/libs/server/post/models/get-post-workers-request";
import { PostWorkers } from "@/libs/server/post/models/post-dao";

const getPostWorkers = async (id: number): Promise<PostWorkers | undefined> => {
  const request: GetPostWorkersRequest = { id }

  return await fetchData(
    async () => getPostWorkersService(request),
    path => redirect(path),
    undefined,
  )
}

export default async function PostUpdatePage({
  params,
}: Readonly<ParamProps<{ [Param.ID]: string }>>) {
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  const postWorkers = await getPostWorkers(id);
  if (!postWorkers) notFound()

  return (
    <div className="space-y-4">
      <PostUpdateHeader postName={postWorkers.name} />
      <PostUpdateNameSection postId={id} postName={postWorkers.name} />
      <PostWorkerTableSection postId={id} postName={postWorkers.name} workers={postWorkers.workers} />
    </div>
  )
}