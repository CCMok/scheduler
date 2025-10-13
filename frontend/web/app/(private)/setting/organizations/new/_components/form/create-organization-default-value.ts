import { CreateOrganizationFormInput } from "@/libs/client/organization/models/create-organization-form-input"
import { CREATE_DEPARTMENT_DEFAULT_BASE } from "../../../[orgId]/departments/new/_components/form/create-department-default-value"

export const CREATE_ORGANIATION_DEFAULT: CreateOrganizationFormInput = {
  ...CREATE_DEPARTMENT_DEFAULT_BASE,
  name: 'Eldia Ltd.',
  departmentName: 'Survey Department',
}