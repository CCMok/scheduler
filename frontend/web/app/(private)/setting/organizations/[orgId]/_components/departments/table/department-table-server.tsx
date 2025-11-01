import DepartmentTable from "./department-table";
import { redirect } from "next/navigation";
import { getDepartmentsWithChildCountService } from "@/libs/server/department/services/get-departments-with-child-count-service";
import { DepartmentWithChildCount } from "@/libs/server/department/models/department-dao";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";

const getDepartments = async (organizationId: number): Promise<DepartmentWithChildCount[]> => {
  const response = await getDepartmentsWithChildCountService(undefined, undefined, organizationId)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  orgId: number;
}

export default async function DepartmentTableServer({
  orgId,
}: Readonly<Props>) {
  const departments = await getDepartments(orgId);
  return (
    <DepartmentTable departments={departments}/>
  )
}