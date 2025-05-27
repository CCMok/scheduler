import { OrganizationDepartments } from "@/libs/server/organization/models/organization-models";

export const getDefaultOrganizationId = (organizationDepartments: OrganizationDepartments[]): string =>
  organizationDepartments.length ? organizationDepartments[0].id.toString() : ''

export const getDefaultDepartmentId = (organizationDepartments: OrganizationDepartments[], organizationId: string): string => {
  const organizationDepartment = organizationDepartments.find(organization => organization.id.toString() === organizationId)

  return organizationDepartment && organizationDepartment.departments.length
    ? organizationDepartment.departments[0].id.toString()
    : '';
}