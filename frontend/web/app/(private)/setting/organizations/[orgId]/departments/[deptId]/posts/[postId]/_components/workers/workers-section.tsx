import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import CustomCard from "@/components/_general/card/custom-card";
import { getWorkerPostsCountService } from "@/libs/server/worker/services/get-worker-posts-count-service";
import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";
import WorkerFilter from "@/components/worker/worker-filter";
import AssignWorkerDialog from "./assign/assign-worker-dialog";
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service";
import { Worker } from "@/external/prisma-generated";
import PostWorkerTable from "./table/post-worker-table";
import { Suspense } from "react";
import TableCardSkeleton from "@/components/_general/skeleton/table-card-skeleton";

const getWorkerPostsCount = async (postId: number): Promise<WorkersPostWorkerCount[]> => {
  return await fetchData(
    async () => await getWorkerPostsCountService({
      where: { postId },
    }),
    path => redirect(path),
    [],
  )
}

const getDepartmentWorkers = async (departmentId: number): Promise<Worker[]> => {
  return await fetchData(
    async () => await getWorkersService({
      where: { departmentId },
      orderBys: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  departmentId: number;
  postId: number;
}

async function WorkersSectionContent({
  departmentId,
  postId,
}: Readonly<Props>) {
  const [postWorkers, departmentWorkers] = await Promise.all([
    getWorkerPostsCount(postId),
    getDepartmentWorkers(departmentId),
  ])

  const assignableWorkers = departmentWorkers.filter(worker => !postWorkers.some(postWorker => postWorker.id === worker.id));

  return (
    <CustomCard>
      <WorkerFilter button={<AssignWorkerDialog workers={assignableWorkers} />} />
      <PostWorkerTable
        workers={postWorkers}
      />
    </CustomCard>
  )
}

export default async function WorkersSection({
  departmentId,
  postId,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<TableCardSkeleton />}>
      <WorkersSectionContent
        departmentId={departmentId}
        postId={postId}
      />
    </Suspense>
  )
}