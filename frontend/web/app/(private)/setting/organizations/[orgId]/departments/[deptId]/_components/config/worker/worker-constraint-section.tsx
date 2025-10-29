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
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";

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

async function WorkerConstraintSectionContent({
  deptId,
}: Readonly<Props>) {
  const [workerConstraints, workerConstraintTypes, workers] = await Promise.all([
    getWorkerConstraints(deptId),
    getWorkerConstraintTypes(),
    getWorkers(deptId),
  ])

  return (
    <>
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
    </>
  )
}

export default function WorkerConstraintSection({
  deptId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <Suspense fallback={<TableSkeleton />}>
        <WorkerConstraintSectionContent deptId={deptId} />
      </Suspense>
    </CustomCard>
  )
}