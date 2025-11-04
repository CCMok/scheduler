import CreateWorkerButton from "./create/create-worker-button";
import CustomCard from "@/components/_general/card/custom-card";
import WorkerFilter from "@/components/worker/worker-filter";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import DepartmentWorkerTableServer from "./table/department-worker-table-server";

type Props = {
  departmentId: number;
}

export default async function WorkersSection({
  departmentId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <WorkerFilter button={<CreateWorkerButton departmentId={departmentId} />} />
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentWorkerTableServer departmentId={departmentId} />
      </Suspense>
    </CustomCard>
  )
}