import { Worker } from "@/external/prisma-generated";
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import WorkerIndividualTable from "@/components/worker/worker-individual-table";
import CreateWorkerButton from "../../../../../../department/[id]/_components/workers/create/create-worker-button";
import CustomCard from "@/components/_general/card/custom-card";

const getWorkers = async (deptId: number): Promise<Worker[]> => {
  return await fetchData(
    async () => await getWorkersService({ where: { departmentId: deptId } }),
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
  const workers = await getWorkers(deptId);

  return (
    <CustomCard>
      <WorkerIndividualTable
       workers={workers} 
       button={<CreateWorkerButton deptId={deptId} />}
       />
    </CustomCard>
  )
}