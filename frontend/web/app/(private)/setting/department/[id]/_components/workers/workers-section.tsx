import { Worker } from "@/external/prisma-generated";
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import UpdateChildLayout from '@/components/_general/layout/update-child/update-child-layout';
import WorkerIndividualTable from "@/components/worker/worker-individual-table";
import CreateWorkerButton from "./create/create-worker-button";

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
    <UpdateChildLayout childName="人員">
      <WorkerIndividualTable
       workers={workers} 
       button={<CreateWorkerButton deptId={deptId} />}
       />
    </UpdateChildLayout>
  )
}