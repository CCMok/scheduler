import PostIndividualTable from "@/components/post/post-individual-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import CreatePostButton from "./create-post-button";
import CustomCard from "@/components/_general/card/custom-card";
import { PostWorkersCount } from "@/libs/server/post/models/post-dao";
import { getPostWorkersCountService } from "@/libs/server/post/services/get-post-workers-count-service";

const getPostWorkersCount = async (deptId: number): Promise<PostWorkersCount[]> => {
  return await fetchData(
    async () => await getPostWorkersCountService({
      where: { departmentId: deptId },
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  deptId: number;
}

export default async function PostsSection({
  deptId,
}: Readonly<Props>) {
  const posts = await getPostWorkersCount(deptId);

  return (
    <CustomCard>
      <PostIndividualTable
        posts={posts}
        button={<CreatePostButton deptId={deptId} />}
      />
    </CustomCard>
  )
}