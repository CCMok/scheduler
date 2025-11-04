import { Department } from "@/external/prisma-generated";
import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { getDepartmentsService } from "@/libs/department/services/get-departments-service";
import { isNil } from "lodash";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

const getDepartment = async (id: number): Promise<Department | undefined> => {
  const entitiesResponse = await getDepartmentsService(id)
  const entities = handleGetResponse(entitiesResponse, redirect, [])
  return entities[0]
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
    return null; // Return null instead of '' to fix hydration error
  }

  const department = await getDepartment(id);
  if (!department) {
    if (failNotFound) notFound();
    return null; // Return null instead of '' to fix hydration error
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