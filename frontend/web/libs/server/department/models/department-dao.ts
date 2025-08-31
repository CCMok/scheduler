import { Department, Organization, Post, Worker } from "@/external/prisma-generated";

export type DepartmentOrganization = Department & { organization: Organization }

export type DepartmentWorkers = Department & { workers: Worker[] }

export type DepartmentWorkersPosts = Department & {
  workers: Worker[];
  posts: Post[];
}