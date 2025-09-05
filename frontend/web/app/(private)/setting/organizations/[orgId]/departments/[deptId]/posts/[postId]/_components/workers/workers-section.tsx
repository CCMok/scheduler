import WorkerIndividualTable from "@/components/worker/worker-individual-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import CustomCard from "@/components/_general/card/custom-card";
import { getWorkerPostsCountService } from "@/libs/server/worker/services/get-worker-posts-count-service";
import { WorkerPostsCount } from "@/libs/server/worker/models/worker-dao";

const getWorkerPostsCount = async (postId: number): Promise<WorkerPostsCount[]> => {
  return await fetchData(
    async () => await getWorkerPostsCountService({ post: { id: postId } }),
    path => redirect(path),
    [],
  )
}

// TODO: potential fix
// SELECT 
//     pw.id, 
//     p.name AS post_name, 
//     w.name AS worker_name, 
//     w.department_id,
//     COALESCE(worker_counts.post_count, 0) AS post_count
// FROM post_worker pw
// INNER JOIN post p ON p.id = pw.post_id
// INNER JOIN worker w ON w.id = pw.worker_id
// LEFT JOIN (
//     SELECT worker_id, COUNT(*) AS post_count
//     FROM post_worker
//     GROUP BY worker_id
// ) worker_counts ON worker_counts.worker_id = w.id
// WHERE p.id = 1;

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