import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import WorkerIndividualTable from "@/components/worker/worker-individual-table";
import CreateWorkerButton from "./create-worker-button";
import CustomCard from "@/components/_general/card/custom-card";
import { WorkerPostsCount } from "@/libs/server/worker/models/worker-dao";
import { getWorkerPostsCountService } from "@/libs/server/worker/services/get-worker-posts-count-service";

const getWorkerPostsCount = async (deptId: number): Promise<WorkerPostsCount[]> => {
  return await fetchData(
    async () => await getWorkerPostsCountService({ where: { departmentId: deptId } }),
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
      <WorkerIndividualTable
       workers={workers} 
       button={<CreateWorkerButton deptId={deptId} />}
       />
    </CustomCard>
  )
}