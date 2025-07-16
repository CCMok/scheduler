import { Department, Organization } from "@/external/prisma-generated";
import { DepartmentWorkers } from "../../department/models/department-model";

export type OrganizationDepartments = Organization & { departments: Department[] }

export type OrganizationDepartmentsWorkers = Organization & { departments: DepartmentWorkers[] }