import { Worker } from "@/external/prisma-generated";
import UpdateChildLayout from "@/components/layout/update-child/update-child-layout";
import WorkerIndividualTable from "@/libs/client/worker/components/worker-individual-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getPostWorkersService } from "@/libs/server/post/services/get-post-workers-service";
import { redirect } from "next/navigation";

const getWorkers = async (postId: number): Promise<Worker[]> => {
  const postWorkers = await fetchData(
    async () => await getPostWorkersService({ id: postId }),
    path => redirect(path),
    undefined,
  )

  if (!postWorkers) return [];
  return postWorkers.workers;
}

type Props = {
  postId: number;
}

export default async function WorkersSection({
  postId,
}: Readonly<Props>) {
  const workers = await getWorkers(postId);

  return (
    <UpdateChildLayout childName="人員">
      <WorkerIndividualTable workers={workers} />
    </UpdateChildLayout>
  )
}