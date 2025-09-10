import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import WorkerTable from "@/components/worker/worker-table";
import CreateWorkerButton from "./create-worker-button";
import CustomCard from "@/components/_general/card/custom-card";
import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";
import { getWorkerPostsCountService } from "@/libs/server/worker/services/get-worker-posts-count-service";
import WorkerFilter from "@/components/worker/worker-filter";

const getWorkerPostsCount = async (deptId: number): Promise<WorkersPostWorkerCount[]> => {
  return await fetchData(
    async () => await getWorkerPostsCountService({
      where: { departmentId: deptId },
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  deptId: number;
}

export default async function WorkersSection({
  deptId,
}: Readonly<Props>) {
  const workers = await getWorkerPostsCount(deptId);

  return (
    <CustomCard>
      <WorkerFilter />
      <WorkerTable
        workers={workers}
        button={<CreateWorkerButton />}
      />
    </CustomCard>
  )
}