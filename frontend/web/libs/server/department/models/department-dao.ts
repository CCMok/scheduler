import { Department, Organization, Post, Worker } from "@/external/prisma-generated";
import { NO_SELECTION_NAME } from "@/libs/client/_general/constants/input-constant";
import { MakeNullable } from "@/libs/share/_general/types/custom-utility-type";
import { Count } from "../../_general/models/count";

export type DepartmentOrganization = Department & { organization: Organization }

export type DepartmentWorkers = Department & { workers: Worker[] }

export type DepartmentWorkersPosts = Department & {
  workers: Worker[];
  posts: Post[];
}

export const DEFAULT_DEPARTMENT_OPTION: MakeNullable<Department, 'id' | 'organizationId'> = {
  id: null,
  organizationId: null,
  name: NO_SELECTION_NAME,
}

export type DepartmentChildrenCount = Department & Count<{
  workers: number;
  posts: number;
}>

export type DepartmentOrganizationChildrenCount = DepartmentOrganization & Count<{
  workers: number;
  posts: number;
}>