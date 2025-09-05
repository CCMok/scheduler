import { Worker } from "@/external/prisma-generated";
import WorkerIndividualTable from "@/components/worker/worker-individual-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getPostWorkersService } from "@/libs/server/post/services/get-post-workers-service";
import { redirect } from "next/navigation";
import CustomCard from "@/components/_general/card/custom-card";

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
    <CustomCard title="人員">
      <WorkerIndividualTable workers={workers} />
    </CustomCard>
  )
}