import { redirect } from "next/navigation";
import CustomCard from "@/components/_general/card/custom-card";
import { getWorkersWithPostWorkersCountService } from "@/libs/server/worker/services/get-workers-with-post-workers-count-service";
import { WorkerWithPostWorkersCount } from "@/libs/server/worker/models/worker-dao";
import WorkerFilter from "@/components/worker/worker-filter";
import AssignWorkerDialog from "./assign/assign-worker-dialog";
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service";
import { Worker } from "@/external/prisma-generated";
import PostWorkerTable from "./table/post-worker-table";
import { Suspense } from "react";
import TableCardSkeleton from "@/components/_general/skeleton/table-card-skeleton";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";

const getWorkerPostsCount = async (postId: number): Promise<WorkerWithPostWorkersCount[]> => {
  const response = await getWorkersWithPostWorkersCountService(undefined, undefined, undefined, postId)
  return handleGetResponse(response, redirect, [])
}

const getDepartmentWorkers = async (departmentId: number): Promise<Worker[]> => {
  const response = await getWorkersService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
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