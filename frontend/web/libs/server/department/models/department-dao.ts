import { Department, Post, Worker } from "@/external/prisma-generated";

export type DepartmentWorkers = Department & { workers: Worker[] }

export type DepartmentWorkersPosts = Department & {
  workers: Worker[];
  posts: Post[];
}