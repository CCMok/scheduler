import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import DepartmentWorkerTable from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/workers/table/department-worker-table";
import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";
import { getWorkerPostsCountService } from "@/libs/server/worker/services/get-worker-posts-count-service";

const getWorkerPostsCount = async (departmentId: number): Promise<WorkersPostWorkerCount[]> => {
  return await fetchData(
    async () => await getWorkerPostsCountService({
      where: { departmentId },
    }),
    path => redirect(path),
    [],
  )
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