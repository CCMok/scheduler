import { Organization } from "@/external/prisma-generated";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import OrganizationQueryComboBox from "@/libs/client/organization/components/organization-query-combo-box";
import { DepartmentParam } from "./department-param";
import { PATH } from "@/libs/share/_general/utils/path";
import { Param } from "@/libs/share/_general/enums/param";
import DepartmentNameQueryInput from "./department-name-query-input";

const getOrganizations = async (): Promise<Organization[]> => {
  return await fetchData(
    async () => await getOrganizationsService({
      orderBy: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
}

export default async function DepartmentFilter() {
  const organizations = await getOrganizations();

  return (
    <div className='flex gap-2'>
      <OrganizationQueryComboBox
        organizations={organizations}
        paramName={DepartmentParam.ORGANIZATION_ID}
        cascadeParamNames={[Param.ID]}
        path={PATH.setting.departments}
      />
      <DepartmentNameQueryInput />
    </div>
  )
}