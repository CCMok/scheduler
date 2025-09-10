import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import PostTable from "@/components/post/post-table";
import CustomCard from "@/components/_general/card/custom-card";
import { getPostWorkersCountService } from "@/libs/server/post/services/get-post-workers-count-service";
import { PostWorkersCount } from "@/libs/server/post/models/post-dao";
import PostFilter from "@/components/post/post-filter";

const getPostWorkersCount = async (workerId: number): Promise<PostWorkersCount[]> => {
  return await fetchData(
    async () => await getPostWorkersCountService({
      where: { workerId },
    }),
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
      <PostFilter />
      <PostTable posts={posts} />
    </CustomCard>
  )
}