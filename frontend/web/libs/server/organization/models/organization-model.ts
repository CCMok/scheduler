import { Organization } from "@/external/prisma-generated";
import { DepartmentWorkers } from "../../department/models/department-model";

export type OrganizationDepartmentsWorkers = Organization & { departments: DepartmentWorkers[] }