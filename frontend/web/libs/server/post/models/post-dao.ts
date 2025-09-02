import { Post, Worker } from "@/external/prisma-generated";
import { DepartmentOrganization } from "../../department/models/department-dao";

export type PostWorkers = Post & {
  workers: Worker[];
}

export type PostDeptOrg = Post & {
  department: DepartmentOrganization;
}