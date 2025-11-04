import DepartmentTable from "./department-table";
import { redirect } from "next/navigation";
import { getDepartmentsWithChildCountService } from "@/libs/department/services/get-departments-with-child-count-service";
import { DepartmentWithChildCount } from "@/libs/department/models/department-dao";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getDepartments = async (organizationId: number): Promise<DepartmentWithChildCount[]> => {
  const response = await getDepartmentsWithChildCountService(undefined, undefined, organizationId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  organizationId: number;
}

export default async function DepartmentTableServer({
  organizationId,
}: Readonly<Props>) {
  const departments = await getDepartments(organizationId);
  return (
    <DepartmentTable departments={departments}/>
  )
}