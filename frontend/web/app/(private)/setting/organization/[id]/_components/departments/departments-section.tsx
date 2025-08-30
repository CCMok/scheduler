import { Card, CardContent, CardHeader, CardTitle } from '@/external/shadcn/components/ui/card';
import DepartmentTable from './department-table';
import { Department } from '@/external/prisma-generated';
import { redirect } from 'next/navigation';
import { fetchData } from '@/libs/share/_general/utils/fetch';
import { GetDepartmentsRequest } from '@/libs/server/department/models/get-department-request';
import { getDepartmentsService } from '@/libs/server/department/services/get-departments-service';

const getDepartments = async (orgId: number): Promise<Department[]> => {
  const request: GetDepartmentsRequest = {
    where: {
      organizationId: orgId,
    }
  }

  return await fetchData(
    async () => await getDepartmentsService(request),
    path => redirect(path),
    [],
  )
}

type Props = {
  orgId: number;
}

export default async function DepartmentsSection({
  orgId,
}: Readonly<Props>) {
  const departments = await getDepartments(orgId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>部門管理</CardTitle>
      </CardHeader>
      <CardContent>
        <DepartmentTable departments={departments} />
      </CardContent>
    </Card>
  )
}