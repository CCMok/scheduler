import { Department, Organization } from "@/external/prisma-generated";

export type OrganizationDepartments = Organization & { departments: Department[] }