import { Department, Organization, Post, Worker } from "@/external/prisma-generated";
import { Count } from "../../_general/models/count";

export type DepartmentWithOrganization = Department & { organization: Organization }

export type DepartmentWithWorkersPosts = Department & {
  workers: Worker[];
  posts: Post[];
}

export type DepartmentWithChildCount = Department & Count<{
  workers: number;
  posts: number;
}>

export type DepartmentWithOrganizationChildrenCount = DepartmentWithOrganization & Count<{
  workers: number;
  posts: number;
}>