import { Department } from "@/external/prisma-generated";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { getDepartmentsService } from "@/libs/department/services/get-departments-service";
import { redirect } from "next/navigation";
import UpdateDepartmentConstraintForm from "./form/update-department-constraint-form";
import { Suspense } from "react";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";

const getDepartment = async (id: number): Promise<Department | undefined> => {
  const response = await getDepartmentsService(id)
  const data = handleGetResponse(response, redirect, [])
  return data[0]
}

type Props = {
  departmentId: number;
}

export default function DepartmentConstraintSection({
  departmentId,
}: Readonly<Props>) {
  const departmentPromise = getDepartment(departmentId)

  return (
    <Suspense fallback={<InputCardSkeleton />}>
      <UpdateDepartmentConstraintForm
        departmentPromise={departmentPromise}
      />
    </Suspense >
  )
}