import CustomCard from "@/components/_general/card/custom-card";
import WorkerConstraintTable from "./worker-constraint-table";
import { getWorkerConstraintWithRelated } from "@/libs/worker-constraint/services/get-worker-constraints-with-related-service";
import { redirect } from "next/navigation";
import { WorkerConstraintWithRelated } from "@/libs/worker-constraint/models/worker-constraint-dao";
import { WorkerConstraintType, Worker } from "@/external/prisma-generated";
import { getWorkerConstraintTypesService } from "@/libs/worker-constraint/services/get-worker-constraint-types-service";
import { getWorkersService } from "@/libs/worker/services/get-workers-service";
import CreateWorkerConstraintButton from "./create/create-worker-constraint-button";
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getWorkerConstraints = async (departmentId: number): Promise<WorkerConstraintWithRelated[]> => {
  const response = await getWorkerConstraintWithRelated(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}
  
const getWorkerConstraintTypes = async (): Promise<WorkerConstraintType[]> => {
  const response = await getWorkerConstraintTypesService()
  return handleGetResponse(response, redirect, [])
}

const getWorkers = async (departmentId: number): Promise<Worker[]> => {
  const response = await getWorkersService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  departmentId: number;
}

async function WorkerConstraintSectionContent({
  departmentId,
}: Readonly<Props>) {
  const [workerConstraints, workerConstraintTypes, workers] = await Promise.all([
    getWorkerConstraints(departmentId),
    getWorkerConstraintTypes(),
    getWorkers(departmentId),
  ])

  return (
    <>
      <div className='flex items-center justify-between'>
        <span className='font-semibold'>人員條件</span>
        <CreateWorkerConstraintButton
          workerConstraintTypes={workerConstraintTypes}
          workers={workers}
          departmentId={departmentId}
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
  departmentId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <Suspense fallback={<TableSkeleton />}>
        <WorkerConstraintSectionContent departmentId={departmentId} />
      </Suspense>
    </CustomCard>
  )
}