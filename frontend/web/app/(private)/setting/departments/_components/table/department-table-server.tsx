import { fetchData } from "@/libs/share/_general/utils/fetch";
import { redirect } from "next/navigation";
import { DepartmentOrganizationChildrenCount } from "@/libs/server/department/models/department-dao";
import { getDepartmentsOrganizationChildrenCountService } from "@/libs/server/department/services/get-departments-organization-children-count-service";
import DepartmentTable from "./department-table";

const getDepartments = async (): Promise<DepartmentOrganizationChildrenCount[]> => {
  return await fetchData(
    async () => await getDepartmentsOrganizationChildrenCountService({}),
    path => redirect(path),
    [],
  )
}

export default async function DepartmentTableServer() {
  const departments = await getDepartments();
  return (
    <DepartmentTable departments={departments}/>
  )
}