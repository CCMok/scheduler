import { Department } from "@/external/prisma-generated";
import DepartmentTable from "./department-table";
import { getDepartmentsService } from "@/libs/server/department/services/get-departments-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import UpdateChildLayout from "@/components/layout/update-child/update-child-layout";

const getDepartments = async (orgId: number): Promise<Department[]> => {
  return await fetchData(
    async () => await getDepartmentsService({ where: { organizationId: orgId } }),
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
    <UpdateChildLayout childName="部門">
      <DepartmentTable departments={departments} />
    </UpdateChildLayout>
  )
}