import { Department, Worker } from "@/external/prisma-generated";

export type DepartmentWorkers = Department & { workers: Worker[] }