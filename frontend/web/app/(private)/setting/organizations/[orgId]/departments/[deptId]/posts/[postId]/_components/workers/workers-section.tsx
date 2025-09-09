import WorkerIndividualTable from "@/components/worker/worker-individual-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import CustomCard from "@/components/_general/card/custom-card";
import { getWorkerPostsCountService } from "@/libs/server/worker/services/get-worker-posts-count-service";
import { WorkersPostWorkerCount } from "@/libs/server/worker/models/worker-dao";

const getWorkerPostsCount = async (postId: number): Promise<WorkersPostWorkerCount[]> => {
  return await fetchData(
    async () => await getWorkerPostsCountService({
      where: { postId },
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  postId: number;
}

export default async function WorkersSection({
  postId,
}: Readonly<Props>) {
  const workers = await getWorkerPostsCount(postId);

  return (
    <CustomCard title="人員">
      <WorkerIndividualTable workers={workers} />
    </CustomCard>
  )
}