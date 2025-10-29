import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { PostsPostWorkersCount } from "@/libs/server/post/models/post-dao";
import { getPostWorkersCountService } from "@/libs/server/post/services/get-post-workers-count-service";
import DepartmentPostTable from "./department-post-table";

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

export default async function DepartmentPostTableServer({
  deptId,
}: Readonly<Props>) {
  const posts = await getPostWorkersCount(deptId);

  return (
    <DepartmentPostTable posts={posts}/>
  )
}