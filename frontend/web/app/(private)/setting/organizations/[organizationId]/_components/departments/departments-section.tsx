import CustomCard from "@/components/_general/card/custom-card";
import DepartmentFilter from "./filter/department-filter";
import CreateDepartmentButton from "./create/create-department-button";
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import DepartmentTable from "./table/department-table";
import { DepartmentWithChildCount } from "@/libs/department/models/department-dao";
import { getDepartmentsWithChildCountService } from "@/libs/department/services/get-departments-with-child-count-service";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { redirect } from "next/navigation";

const getDepartments = async (organizationId: number): Promise<DepartmentWithChildCount[]> => {
  const response = await getDepartmentsWithChildCountService(undefined, undefined, organizationId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  organizationId: number;
}

export default function DepartmentsSection({
  organizationId,
}: Readonly<Props>) {
  const departmentsPromise = getDepartments(organizationId);

  return (
    <CustomCard>
      <DepartmentFilter button={<CreateDepartmentButton organizationId={organizationId} />} />
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentTable
          departmentsPromise={departmentsPromise}
        />
      </Suspense>
    </CustomCard>
  )
}