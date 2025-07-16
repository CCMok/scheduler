import { Department, Organization } from "@/external/prisma-generated";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-model";

export const getDefaultOrganizationId = (organizations: Organization[]): string =>
  organizations[0]?.id.toString() ?? '';

export const getDefaultDepartmentIdInOrganizations = (organizations: OrganizationDepartments[]): string =>
  organizations[0]?.departments[0]?.id.toString() ?? '';

export const getDefaultDepartmentIdInDepartments = (departments: Department[]): string =>
  departments[0]?.id.toString() ?? '';