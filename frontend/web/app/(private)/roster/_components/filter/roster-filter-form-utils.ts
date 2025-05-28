import { Department } from "@/external/prisma-generated";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-models";

export const getDefaultOrganizationId = (organizations: OrganizationDepartments[]): string =>
  organizations.length ? organizations[0].id.toString() : ''

export const getDefaultDepartmentId = (organizations: OrganizationDepartments[], organizationId: string): string => {
  const departments = getDepartments(organizations, organizationId)
  return departments.length ? departments[0].id.toString() : '';
}

export const getDepartments = (organizations: OrganizationDepartments[], organizationId: string): Department[] => {
  const organizationDepartment = organizations.find(organization => organization.id.toString() === organizationId)
  return organizationDepartment ? organizationDepartment.departments : [];
}