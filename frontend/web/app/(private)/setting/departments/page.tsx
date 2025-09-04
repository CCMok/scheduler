import { SearchParamProps } from "@/libs/share/_general/props/param-props";
import { DepartmentParam } from "./_components/department-param";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";
import { isNil } from "lodash";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { DepartmentRelate } from "@/libs/server/department/models/get-department-request";
import ManageTableSection from '@/components/_general/table/manage-table-section';
import DepartmentFilter from "./_components/department-filter";
import DepartmentTable from "./_components/department-table";
import { toNumber } from "@/libs/share/_general/utils/number";

const getDepartments = async (orgId?: number): Promise<DepartmentOrganization[]> => {
  return await fetchData(
    async () => await getDepartmentsService({
      where: {
        ...(isNil(orgId) ? {} : { organizationId: orgId }),
      },
      relate: [DepartmentRelate.ORGANIZATION],
    }),
    path => redirect(path),
    [],
  )
}

type Props = SearchParamProps<{
  [DepartmentParam.ORGANIZATION_ID]: string | undefined,
}>

export default async function DepartmentsPage({
  searchParams,
}: Readonly<Props>) {
  const params = await searchParams;
  const orgId = toNumber(params.organizationId);

  const departments = await getDepartments(orgId);

  return (
    <ManageTableSection
      title="部門管理"
      filter={<DepartmentFilter />}
      table={<DepartmentTable departments={departments} />}
    />
  )
}