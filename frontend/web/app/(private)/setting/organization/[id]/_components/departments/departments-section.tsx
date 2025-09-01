import DepartmentTable from './department-table';
import { Department } from '@/external/prisma-generated';
import { redirect } from 'next/navigation';
import { fetchData } from '@/libs/share/_general/utils/fetch';
import { getDepartmentsService } from '@/libs/server/department/services/get-departments-service';
import ManageTableSection from '@/components/table/manage-table-section';

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
  orgId: number;
}

export default async function DepartmentsSection({
  orgId,
}: Readonly<Props>) {
  const departments = await getDepartments(orgId);

  return (
    <ManageTableSection
      title="部門管理"
      table={<DepartmentTable departments={departments} />}
    />
  )
}