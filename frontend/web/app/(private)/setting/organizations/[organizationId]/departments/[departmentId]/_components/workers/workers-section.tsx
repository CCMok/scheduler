import CreateWorkerButton from "./create/create-worker-button";
import CustomCard from "@/components/_general/card/custom-card";
import WorkerFilter from "@/components/worker/worker-filter";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import { WorkerWithPostWorkersCount } from "@/libs/worker/models/worker-dao";
import { getWorkersWithPostWorkersCountService } from "@/libs/worker/services/get-workers-with-post-workers-count-service";
import { redirect } from "next/navigation";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import DepartmentWorkerTable from "./table/department-worker-table";

const getWorkerPostsCount = async (departmentId: number): Promise<WorkerWithPostWorkersCount[]> => {
  const response = await getWorkersWithPostWorkersCountService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  departmentId: number;
}

export default function WorkersSection({
  departmentId,
}: Readonly<Props>) {
  const workersPromise = getWorkerPostsCount(departmentId);

  return (
    <CustomCard>
      <WorkerFilter button={<CreateWorkerButton departmentId={departmentId} />} />
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentWorkerTable
          workersPromise={workersPromise}
        />
      </Suspense>
    </CustomCard>
  )
}