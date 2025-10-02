import { Worker } from "@/external/prisma-generated"
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { notFound, redirect } from "next/navigation"
import UpdateWorkerNameSection from "./update-worker-name-section"
import { Suspense } from "react"
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton"

const getWorker = async (id: number): Promise<Worker | undefined> => {
  const workers = await fetchData(
    async () => await getWorkersService({
      where: { id },
    }),
    path => redirect(path),
    [],
  )

  return workers[0];
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