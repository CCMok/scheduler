import { Organization } from "@/external/prisma-generated";
import CreateDepartmentButton from "./create-department-button";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { redirect } from "next/navigation";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";

const getOrganizations = async (): Promise<Organization[]> => {
  const response = await getOrganizationsService()
  return handleGetResponse(response, redirect, [])
}

export default async function CreateDepartmentButtonServer() {
  const organizations = await getOrganizations();
  return (
    <CreateDepartmentButton organizations={organizations} />
  )
}