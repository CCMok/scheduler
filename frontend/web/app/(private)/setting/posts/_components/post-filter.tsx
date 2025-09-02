import { Department, Organization } from "@/external/prisma-generated";
import OrganizationQueryComboBox from "@/libs/client/organization/components/organization-query-combo-box";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { PostParam } from "./post-param";
import { PATH } from "@/libs/share/_general/utils/path";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { isNil } from "lodash";
import DepartmentQueryComboBox from "@/libs/client/department/components/department-query-combo-box";
import PostNameQueryInput from "./post-name-query-input";
import FilterLayout from "@/components/layout/filter/filter-layout";

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

export default async function PostFilter({
  orgId
}: Readonly<Props>) {
  const organizations = await getOrganizations();
  const departments = isNil(orgId) ? [] : await getDepartments(orgId);

  return (
    <FilterLayout>
      <OrganizationQueryComboBox
        organizations={organizations}
        paramName={PostParam.ORGANIZATION_ID}
        cascadeParamNames={[PostParam.DEPARTMENT_ID]}
        path={PATH.setting.posts}
      />
      <DepartmentQueryComboBox
        departments={departments}
        paramName={PostParam.DEPARTMENT_ID}
        path={PATH.setting.posts}
      />
      <PostNameQueryInput />
    </FilterLayout>
  )
}