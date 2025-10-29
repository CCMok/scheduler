import { Organization } from "@/external/prisma-generated";
import CreateDepartmentButton from "./create-department-button";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { redirect } from "next/navigation";

const getOrganizations = async (): Promise<Organization[]> => {
  return await fetchData(
    async () => await getOrganizationsService({}),
    path => redirect(path),
    [],
  )
}

export default async function CreateDepartmentButtonServer() {
  const organizations = await getOrganizations();
  return (
    <CreateDepartmentButton organizations={organizations} />
  )
}