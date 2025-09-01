import PostUpdateNameSection from "./_components/name/post-update-name-section";
import PostWorkerTableSection from "./_components/table/post-worker-table-section";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { notFound, redirect } from "next/navigation";
import { getPostWorkersService } from "@/libs/server/post/services/get-post-workers-service";
import { GetPostWorkersRequest } from "@/libs/server/post/models/get-post-workers-request";
import { PostWorkers } from "@/libs/server/post/models/post-dao";
import Header from "@/components/header/header";
import { PostUpdateStoreProvider } from "./_components/store/post-update-store-provider";

const getPostWorkers = async (id: number): Promise<PostWorkers | undefined> => {
  const request: GetPostWorkersRequest = { id }

  return await fetchData(
    async () => getPostWorkersService(request),
    path => redirect(path),
    undefined,
  )
}

type Props = ParamProps<{ [Param.ID]: string }>

export default async function PostEditPage({
  params,
}: Readonly<Props>) {
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
        <Header>
          <span>{postWorkers.name}</span>
        </Header>
        <PostUpdateNameSection />
        <PostWorkerTableSection />
      </div>
    </PostUpdateStoreProvider>
  )
}