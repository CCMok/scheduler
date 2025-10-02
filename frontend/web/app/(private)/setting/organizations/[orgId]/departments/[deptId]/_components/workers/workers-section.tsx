import CreateWorkerButton from "./create/create-worker-button";
import CustomCard from "@/components/_general/card/custom-card";
import WorkerFilter from "@/components/worker/worker-filter";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import DepartmentWorkerTableServer from "./table/department-worker-table-server";

type Props = {
  deptId: number;
}

export default async function WorkersSection({
  deptId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <WorkerFilter button={<CreateWorkerButton />} />
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentWorkerTableServer deptId={deptId} />
      </Suspense>
    </CustomCard>
  )
}