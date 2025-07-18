import { Department, Organization } from "@/external/prisma-generated";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-dao";

export const getDefaultOrganizationId = (organizations: Organization[]): string =>
  organizations.length ? organizations[0].id.toString() : '';

export const getDefaultDepartmentIdInOrganizations = (organizations: OrganizationDepartments[]): string =>
  organizations.length && organizations[0].departments.length ? organizations[0].departments[0].id.toString() : '';

export const getDefaultDepartmentIdInDepartments = (departments: Department[]): string =>
  departments.length ? departments[0].id.toString() : '';