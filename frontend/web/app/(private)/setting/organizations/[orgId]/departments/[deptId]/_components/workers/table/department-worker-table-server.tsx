import { redirect } from "next/navigation";
import DepartmentWorkerTable from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/workers/table/department-worker-table";
import { WorkerWithPostWorkersCount } from "@/libs/worker/models/worker-dao";
import { getWorkersWithPostWorkersCountService } from "@/libs/worker/services/get-workers-with-post-workers-count-service";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getWorkerPostsCount = async (departmentId: number): Promise<WorkerWithPostWorkersCount[]> => {
  const response = await getWorkersWithPostWorkersCountService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  deptId: number;
}

export default async function DepartmentWorkerTableServer({
  deptId,
}: Readonly<Props>) {
  const workers = await getWorkerPostsCount(deptId);

  return (
    <DepartmentWorkerTable workers={workers} />
  )
}