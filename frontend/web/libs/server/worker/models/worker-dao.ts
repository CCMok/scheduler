import { Post, Worker } from "@/external/prisma-generated";
import { DepartmentOrganization } from "../../department/models/department-dao";
import { Count } from "../../_general/models/count";

export type WorkerPosts = Worker & {
  posts: Post[];
}

export type WorkerDeptOrg = Worker & {
  department: DepartmentOrganization;
}

export type WorkerPostsCount = Worker & Count<{
  postWorkers: number;
}>