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

export default async function WorkersSection({
  departmentId,
  postId,
}: Readonly<Props>) {
  const postWorkers = await getWorkerPostsCount(postId);
  const departmentWorkers = await getDepartmentWorkers(departmentId);

  const assignableWorkers = departmentWorkers.filter(worker => !postWorkers.some(postWorker => postWorker.id === worker.id));

  return (
    <CustomCard title="人員">
      <WorkerFilter />
      <PostWorkerTable
        workers={postWorkers}
        button={<AssignWorkerDialog workers={assignableWorkers} />}
      />
    </CustomCard>
  )
}