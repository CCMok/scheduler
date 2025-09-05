import { Post, Worker } from "@/external/prisma-generated";
import { DepartmentOrganization } from "../../department/models/department-dao";
import { Count } from "../../_general/models/count";

export type PostWorkers = Post & {
  workers: Worker[];
}

export type PostDeptOrg = Post & {
  department: DepartmentOrganization;
}

export type PostWorkersCount = Post & Count<{
  postWorkers: number;
}>