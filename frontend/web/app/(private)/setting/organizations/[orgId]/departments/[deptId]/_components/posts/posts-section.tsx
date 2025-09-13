import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import CreatePostButton from "./create/create-post-button";
import CustomCard from "@/components/_general/card/custom-card";
import { PostsPostWorkersCount } from "@/libs/server/post/models/post-dao";
import { getPostWorkersCountService } from "@/libs/server/post/services/get-post-workers-count-service";
import PostFilter from "@/components/post/post-filter";
import DepartmentPostTable from "./table/department-post-table";

const getPostWorkersCount = async (deptId: number): Promise<PostsPostWorkersCount[]> => {
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
      <PostFilter button={<CreatePostButton />} />
      <DepartmentPostTable
        posts={posts}
      />
    </CustomCard>
  )
}