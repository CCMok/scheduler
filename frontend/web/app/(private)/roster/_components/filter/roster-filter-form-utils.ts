import { Worker } from "@/external/prisma-generated";
import { DepartmentWorkers } from "@/libs/server/department/models/department-model";
import { OrganizationDepartmentsWorkers } from "@/libs/server/organization/models/organization-model";

export const getDefaultOrganizationId = (organizations: OrganizationDepartmentsWorkers[]): string =>
  organizations.length ? organizations[0].id.toString() : ''

export const getDefaultDepartmentId = (organizations: OrganizationDepartmentsWorkers[], organizationId: string): string => {
  const departments = getDepartments(organizations, organizationId)
  return departments.length ? departments[0].id.toString() : '';
}

export const getDepartments = (organizations: OrganizationDepartmentsWorkers[], organizationId: string): DepartmentWorkers[] => {
  const organizationDepartment = organizations.find(organization => organization.id.toString() === organizationId)
  return organizationDepartment ? organizationDepartment.departments : [];
}

export const getWorkers = (departments: DepartmentWorkers[], departmentId: string): Worker[] => {
  const department = departments.find(department => department.id.toString() === departmentId)
  return department ? department.workers : [];
}