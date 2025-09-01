import { Department, Organization } from "@/external/prisma-generated";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { isNil } from "lodash";
import OrganizationQueryComboBox from "@/libs/client/organization/components/organization-query-combo-box";
import { DepartmentParam } from "./department-param";
import { PATH } from "@/libs/share/_general/utils/path";
import { Param } from "@/libs/share/_general/enums/param";
import DepartmentQueryComboBox from "@/libs/client/department/components/department-query-combo-box";

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

export default async function DepartmentFilter({
  orgId
}: Readonly<Props>) {
  const organizations = await getOrganizations();
  const departments = isNil(orgId) ? [] : await getDepartments(orgId);

  return (
    <div className='flex gap-2'>
      <OrganizationQueryComboBox
        organizations={organizations}
        paramName={DepartmentParam.ORGANIZATION_ID}
        cascadeParamNames={[Param.ID]}
        path={PATH.setting.departments}
      />
      <DepartmentQueryComboBox
        departments={departments}
        paramName={Param.ID}
        path={PATH.setting.departments}
      />
    </div>
  )
}