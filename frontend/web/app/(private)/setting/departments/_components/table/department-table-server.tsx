import { redirect } from "next/navigation";
import { DepartmentWithOrganizationChildrenCount } from "@/libs/server/department/models/department-dao";
import DepartmentTable from "./department-table";
import { getDepartmentsWithOrganizationChildCountService } from "@/libs/server/department/services/get-departments-with-organization-child-count-service";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";

const getDepartments = async (): Promise<DepartmentWithOrganizationChildrenCount[]> => {
  const response = await getDepartmentsWithOrganizationChildCountService()
  return handleGetResponse(response, redirect, [])
}

export default async function DepartmentTableServer() {
  const departments = await getDepartments();
  return (
    <DepartmentTable departments={departments}/>
  )
}