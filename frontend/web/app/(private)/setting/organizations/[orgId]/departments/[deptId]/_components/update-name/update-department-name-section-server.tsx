import { Department } from "@/external/prisma-generated"
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { notFound, redirect } from "next/navigation"
import UpdateDepartmentNameSection from "./update-department-name-section"
import { Suspense } from "react"
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton"

const getDepartment = async (id: number): Promise<Department | undefined> => {
  const departments = await fetchData(
    async () => await getDepartmentsService({
      where: { id },
    }),
    path => redirect(path),
    [],
  )

  return departments[0];
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