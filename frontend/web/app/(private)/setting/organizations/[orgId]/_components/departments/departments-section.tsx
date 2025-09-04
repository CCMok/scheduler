import DepartmentTable from "./department-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import UpdateChildLayout from '@/components/_general/layout/update-child/update-child-layout';
import { getDepartmentChildrenCountsService } from "@/libs/server/department/services/get-department-children-counts-service";
import { DepartmentChildrenCount } from "@/libs/server/department/models/department-dao";

const getDepartments = async (orgId: number): Promise<DepartmentChildrenCount[]> => {
  return await fetchData(
    async () => await getDepartmentChildrenCountsService({ where: { organizationId: orgId } }),
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
    // TODO: filter
    <UpdateChildLayout>
      <DepartmentTable departments={departments} />
    </UpdateChildLayout>
  )
}