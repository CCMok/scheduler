import { redirect } from "next/navigation";
import DepartmentWorkerTable from "@/app/(private)/setting/organizations/[organizationId]/departments/[departmentId]/_components/workers/table/department-worker-table";
import { WorkerWithPostWorkersCount } from "@/libs/worker/models/worker-dao";
import { getWorkersWithPostWorkersCountService } from "@/libs/worker/services/get-workers-with-post-workers-count-service";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getWorkerPostsCount = async (departmentId: number): Promise<WorkerWithPostWorkersCount[]> => {
  const response = await getWorkersWithPostWorkersCountService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  departmentId: number;
}

export default async function DepartmentWorkerTableServer({
  departmentId,
}: Readonly<Props>) {
  const workers = await getWorkerPostsCount(departmentId);

  return (
    <DepartmentWorkerTable workers={workers} />
  )
}