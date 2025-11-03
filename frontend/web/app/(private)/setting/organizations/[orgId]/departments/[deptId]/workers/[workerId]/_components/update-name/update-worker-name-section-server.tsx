import { Worker } from "@/external/prisma-generated"
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service"
import { notFound, redirect } from "next/navigation"
import UpdateWorkerNameSection from "./update-worker-name-section"
import { Suspense } from "react"
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton"
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils"

const getWorker = async (id: number): Promise<Worker | undefined> => {
  const response = await getWorkersService(id)
  const data = handleGetResponse(response, redirect, [])
  return data[0]
}

type Props = {
  id: number;
}

async function UpdateWorkerNameSectionServerContent({
  id,
}: Readonly<Props>) {
  const worker = await getWorker(id);
  if (!worker) notFound();

  return (
    <UpdateWorkerNameSection
      worker={worker}
    />
  )
}

export default function UpdateWorkerNameSectionServer({
  id,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<InputCardSkeleton />}>
      <UpdateWorkerNameSectionServerContent id={id} />
    </Suspense>
  )
}