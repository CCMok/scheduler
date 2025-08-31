import { Department, Organization } from "@/external/prisma-generated";
import OrganizationComboBox from "./organization-combo-box";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import DepartmentComboBox from "./department-combo-box";

const getOrganizations = async (): Promise<Organization[]> => {
  return await fetchData(
    async () => await getOrganizationsService({}),
    path => redirect(path),
    [],
  )
}

const getDepartments = async (): Promise<Department[]> => {
  return await fetchData(
    async () => await getDepartmentsService({}),
    path => redirect(path),
    [],
  )
}

export default async function DepartmentFilter() {
  const organizations = await getOrganizations();
  // TODO: filter by organizationId
  const departments = await getDepartments();

  return (
    <div className='flex gap-2'>
      <OrganizationComboBox organizations={organizations} />
      <DepartmentComboBox departments={departments} />
    </div>
  )
}