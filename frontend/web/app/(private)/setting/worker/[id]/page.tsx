import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { notFound, redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { WorkerPosts } from "@/libs/server/worker/models/worker-dao";
import { GetWorkerPostsRequest } from "@/libs/server/worker/models/get-worker-posts-request";
import { getWorkerPostsService } from "@/libs/server/worker/services/get-worker-posts-service";
import WorkerUpdateNameSection from "./_components/name/worker-update-name-section";
import WorkerPostTableSection from "./_components/table/worker-post-table-section";
import { WorkerUpdateStoreProvider } from "./_components/store/worker-update-store-provider";
import BackHeader from "@/components/header/back-header";

const getWorkerPosts = async (id: number): Promise<WorkerPosts | undefined> => {
  const request: GetWorkerPostsRequest = { id }

  return await fetchData(
    async () => getWorkerPostsService(request),
    path => redirect(path),
    undefined,
  )
}

type Props = ParamProps<{ [Param.ID]: string }>

export default async function WorkerEditPage({
  params,
}: Readonly<Props>) {
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  const workerPosts = await getWorkerPosts(id);
  if (!workerPosts) notFound()

  return (
    <WorkerUpdateStoreProvider initState={{
      workerId: id,
      workerName: workerPosts.name,
      posts: workerPosts.posts,
      departmentId: workerPosts.departmentId,
    }}>
      <div className="space-y-4">
        <BackHeader>
          <span>{workerPosts.name}</span>
        </BackHeader>
        <WorkerUpdateNameSection />
        <WorkerPostTableSection />
      </div>
    </WorkerUpdateStoreProvider>
  )
}