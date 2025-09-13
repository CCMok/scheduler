import DepartmentTable from "./table/department-table";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { getDepartmentsChildrenCountService } from "@/libs/server/department/services/get-departments-children-count-service";
import { DepartmentChildrenCount } from "@/libs/server/department/models/department-dao";
import CustomCard from "@/components/_general/card/custom-card";
import DepartmentFilter from "./filter/department-filter";
import CreateDepartmentButton from "./create/create-department-button";

const getDepartments = async (organizationId: number): Promise<DepartmentChildrenCount[]> => {
  return await fetchData(
    async () => await getDepartmentsChildrenCountService({
      where: { organizationId },
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
    <CustomCard>
      <DepartmentFilter button={<CreateDepartmentButton />} />
      <DepartmentTable
        departments={departments}
      />
    </CustomCard>
  )
}