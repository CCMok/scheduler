import CustomCard from "@/components/_general/card/custom-card";
import WorkerConstraintTable from "./worker-constraint-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getWorkerConstraintWorkersService } from "@/libs/server/worker-constraint/services/get-worker-constraints-workers-service";
import { redirect } from "next/navigation";
import { WorkerConstraintWorkers } from "@/libs/server/worker-constraint/models/worker-constraint-dao";
import { WorkerConstraintType, Worker } from "@/external/prisma-generated";
import { getWorkerConstraintTypesService } from "@/libs/server/worker-constraint-type/services/get-worker-constraint-types-service";
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service";
import CreateWorkerConstraintButton from "./create/create-worker-constraint-button";

const getWorkerConstraints = async (departmentId: number): Promise<WorkerConstraintWorkers[]> => {
  return await fetchData(
    async () => getWorkerConstraintWorkersService({
      where: { departmentId },
    }),
    path => redirect(path),
    [],
  )
}

const getWorkerConstraintTypes = async (): Promise<WorkerConstraintType[]> => {
  return await fetchData(
    async () => getWorkerConstraintTypesService({}),
    path => redirect(path),
    [],
  )
}

const getWorkers = async (departmentId: number): Promise<Worker[]> => {
  return await fetchData(
    async () => getWorkersService({
      where: { departmentId },
      orderBys: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  deptId: number;
}

export default async function WorkerConstraintSection({
  deptId,
}: Readonly<Props>) {
  const workerConstraints = await getWorkerConstraints(deptId);
  const workerConstraintTypes = await getWorkerConstraintTypes();
  const workers = await getWorkers(deptId);

  return (
    <CustomCard>
      <div className='flex items-center justify-between'>
        <span className='font-semibold'>人員條件</span>
        <CreateWorkerConstraintButton
          workerConstraintTypes={workerConstraintTypes}
          workers={workers}
          departmentId={deptId}
        />
      </div>
      <WorkerConstraintTable
        workerConstraints={workerConstraints}
        workerConstraintTypes={workerConstraintTypes}
        workers={workers}
      />
    </CustomCard>
  )
}