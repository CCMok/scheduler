import { Card, CardContent, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import DepartmentFilter from "./department-filter";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { DepartmentRelate } from "@/libs/server/department/models/get-department-request";
import { isNil } from "lodash";
import DepartmentTable from "./department-table";

const getDepartments = async (id?: number, orgId?: number): Promise<DepartmentOrganization[]> => {
  return await fetchData(
    async () => await getDepartmentsService({
      where: {
        ...(isNil(id) ? {} : { id }),
        ...(isNil(orgId) ? {} : { organizationId: orgId }),
      },
      relate: [DepartmentRelate.ORGANIZATION],
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  id?: number;
  orgId?: number;
}

export default async function ManageDepartmentsSection({
  id,
  orgId,
}: Readonly<Props>) {
  const departments = await getDepartments(id, orgId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>部門管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DepartmentFilter orgId={orgId} />
        <DepartmentTable departments={departments} />
      </CardContent>
    </Card>
  )
}