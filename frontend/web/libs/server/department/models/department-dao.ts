import { Department, Organization, Post, Worker } from "@/external/prisma-generated";
import { NO_SELECTION_NAME } from "@/libs/client/_general/constants/input-constant";
import { MakeNullable } from "@/libs/share/_general/types/custom-utility-type";
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