import { Department, Organization, Post } from "@/external/prisma-generated";

export type PostOrganization = Post & {
  department: Department & {
    organization: Organization;
  };
};