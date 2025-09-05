import DepartmentTable from "./department-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { getDepartmentChildrenCountService } from "@/libs/server/department/services/get-department-children-count-service";
import { DepartmentChildrenCount } from "@/libs/server/department/models/department-dao";
import CustomCard from "@/components/_general/card/custom-card";
import DepartmentFilter from "./department-filter";

const getDepartments = async (orgId: number): Promise<DepartmentChildrenCount[]> => {
  return await fetchData(
    async () => await getDepartmentChildrenCountService({ where: { organizationId: orgId } }),
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
    <CustomCard>
      <DepartmentFilter />
      <DepartmentTable departments={departments} />
    </CustomCard>
  )
}