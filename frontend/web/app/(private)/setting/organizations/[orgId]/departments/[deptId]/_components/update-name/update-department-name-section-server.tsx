import { Department } from "@/external/prisma-generated"
import { getDepartmentsService } from "@/libs/department/services/get-departments-service"
import { notFound, redirect } from "next/navigation"
import UpdateDepartmentNameSection from "./update-department-name-section"
import { Suspense } from "react"
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton"
import { handleGetResponse } from "@/libs/_general/utils/response-utils"

const getDepartment = async (id: number): Promise<Department | undefined> => {
  const entitiesResponse = await getDepartmentsService(id);
  const entities = handleGetResponse(entitiesResponse, redirect, [])
  return entities[0]
}

type Props = {
  id: number;
}

async function UpdateDepartmentNameSectionServerContent({
  id,
}: Readonly<Props>) {
  const department = await getDepartment(id);

  if (!department) notFound();

  return (
    <UpdateDepartmentNameSection
      department={department}
    />
  )
}

export default function UpdateDepartmentNameSectionServer({
  id,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<InputCardSkeleton />}>
      <UpdateDepartmentNameSectionServerContent id={id} />
    </Suspense>
  )
}