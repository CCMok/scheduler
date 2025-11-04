import CustomCard from "@/components/_general/card/custom-card";
import DepartmentFilter from "./filter/department-filter";
import CreateDepartmentButton from "./create/create-department-button";
import DepartmentTableServer from "./table/department-table-server";
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";

type Props = {
  organizationId: number;
}

export default async function DepartmentsSection({
  organizationId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <DepartmentFilter button={<CreateDepartmentButton organizationId={organizationId} />} />
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentTableServer organizationId={organizationId} />
      </Suspense>
    </CustomCard>
  )
}