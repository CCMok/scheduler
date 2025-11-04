import { redirect } from "next/navigation";
import { PostWithPostWorkersCount } from "@/libs/post/models/post-dao";
import { getPostsWithPostWorkersCountService } from "@/libs/post/services/get-posts-with-post-workers-count-service";
import DepartmentPostTable from "./department-post-table";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getPostWorkersCount = async (departmentId: number): Promise<PostWithPostWorkersCount[]> => {
  const response = await getPostsWithPostWorkersCountService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
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