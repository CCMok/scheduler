import { Department } from "@/external/prisma-generated";
import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { isNil } from "lodash";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

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

export type Props = {
  id?: number;
  failNotFound?: boolean;
}

async function DepartmentNameContent({
  id,
  failNotFound = false,
}: Readonly<Props>) {
  if (isNil(id)) {
    if (failNotFound) notFound();
    return '';
  }

  const department = await getDepartment(id);
  if (!department) {
    if (failNotFound) notFound();
    return '';
  }

  return department.name;
}

export default function DepartmentName({
  id,
  failNotFound,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<Skeleton className='h-4 w-20' />}>
      <DepartmentNameContent
        id={id}
        failNotFound={failNotFound}
      />
    </Suspense>
  )
}