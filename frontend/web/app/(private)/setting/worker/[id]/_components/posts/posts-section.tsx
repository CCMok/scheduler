import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import PostIndividualTable from "@/components/post/post-individual-table";
import CustomCard from "@/components/_general/card/custom-card";
import { getPostWorkersCountService } from "@/libs/server/post/services/get-post-workers-count-service";
import { PostWorkersCount } from "@/libs/server/post/models/post-dao";

const getPostWorkersCount = async (workerId: number): Promise<PostWorkersCount[]> => {
  return await fetchData(
    async () => await getPostWorkersCountService({ worker: { id: workerId } }),
    path => redirect(path),
    [],
  )
}

type Props = {
  workerId: number;
}

export default async function PostsSection({
  workerId,
}: Readonly<Props>) {
  const posts = await getPostWorkersCount(workerId);

  return (
    <CustomCard title="職位">
      <PostIndividualTable posts={posts} />
    </CustomCard>
  )
}