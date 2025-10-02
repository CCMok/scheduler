import CustomCard from "@/components/_general/card/custom-card";
import DepartmentFilter from "./filter/department-filter";
import CreateDepartmentButton from "./create/create-department-button";
import DepartmentTableServer from "./table/department-table-server";
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";

type Props = {
  orgId: number;
}

export default async function DepartmentsSection({
  orgId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <DepartmentFilter button={<CreateDepartmentButton />} />
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentTableServer orgId={orgId} />
      </Suspense>
    </CustomCard>
  )
}