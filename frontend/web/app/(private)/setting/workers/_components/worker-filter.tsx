import { Department, Organization } from "@/external/prisma-generated";
import OrganizationQueryComboBox from "@/libs/client/organization/components/organization-query-combo-box";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { PATH } from "@/libs/share/_general/utils/path";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { isNil } from "lodash";
import DepartmentQueryComboBox from "@/libs/client/department/components/department-query-combo-box";
import FilterLayout from "@/components/layout/filter/filter-layout";
import { WorkerParam } from "./worker-param";
import WorkerNameQueryInput from "./worker-name-query-input";

const getOrganizations = async (): Promise<Organization[]> => {
  return await fetchData(
    async () => await getOrganizationsService({
      orderBy: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
}

const getDepartments = async (orgId: number): Promise<Department[]> => {
  return await fetchData(
    async () => await getDepartmentsService({
      where: {
        organizationId: orgId,
      },
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  orgId?: number;
}

export default async function WorkerFilter({
  orgId
}: Readonly<Props>) {
  const organizations = await getOrganizations();
  const departments = isNil(orgId) ? [] : await getDepartments(orgId);

  return (
    <FilterLayout>
      <OrganizationQueryComboBox
        organizations={organizations}
        paramName={WorkerParam.ORGANIZATION_ID}
        cascadeParamNames={[WorkerParam.DEPARTMENT_ID]}
        path={PATH.setting.workers}
      />
      <DepartmentQueryComboBox
        departments={departments}
        paramName={WorkerParam.DEPARTMENT_ID}
        path={PATH.setting.workers}
      />
      <WorkerNameQueryInput />
    </FilterLayout>
  )
}