import { Worker } from "@/external/prisma-generated";
import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { getWorkersService } from "@/libs/worker/services/get-workers-service";
import { isNil } from "lodash";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

const getWorker = async (id: number): Promise<Worker | undefined> => {
  const response = await getWorkersService(id)
  const data = handleGetResponse(response, redirect, [])
  return data[0]
}

export type Props = {
  id?: number;
  failNotFound?: boolean;
}

async function WorkerNameContent({
  id,
  failNotFound = false,
}: Readonly<Props>) {
  if (isNil(id)) {
    if (failNotFound) notFound();
    return '';
  }

  const worker = await getWorker(id);
  if (!worker) {
    if (failNotFound) notFound();
    return '';
  }

  return worker.name;
}

export default function WorkerName({
  id,
  failNotFound,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<Skeleton className='h-4 w-20' />}>
      <WorkerNameContent
        id={id}
        failNotFound={failNotFound}
      />
    </Suspense>
  )
}