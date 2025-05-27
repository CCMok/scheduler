import { Department } from "@/external/prisma-generated";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-models";

export const getDefaultOrganizationId = (organizationDepartments: OrganizationDepartments[]): string =>
  organizationDepartments.length ? organizationDepartments[0].id.toString() : ''

export const getDefaultDepartmentId = (organizationDepartments: OrganizationDepartments[], organizationId: string): string => {
  const departments = getDepartments(organizationDepartments, organizationId)
  return departments.length ? departments[0].id.toString() : '';
}

export const getDepartments = (organizationDepartments: OrganizationDepartments[], organizationId: string): Department[] => {
  const organizationDepartment = organizationDepartments.find(organization => organization.id.toString() === organizationId)
  return organizationDepartment ? organizationDepartment.departments : [];
}