import { Department, Organization } from "@/external/prisma-generated";
import { NO_SELECTION_NAME } from "@/libs/client/_general/constants/option-constant";
import { MakeNullable } from "@/libs/share/_general/types/custom-utility-type";

export type OrganizationDepartments = Organization & { departments: Department[] }

export const DEFAULT_ORGANIZATION_OPTION: MakeNullable<Organization, 'id'> = {
  id: null,
  name: NO_SELECTION_NAME,
  maxHistoryCount: null,
}