import { Post, Worker } from "@/external/prisma-generated";
import { DepartmentOrganization } from "../../department/models/department-dao";

export type WorkerPosts = Worker & {
  posts: Post[];
}

export type WorkerDeptOrg = Worker & {
  department: DepartmentOrganization;
}