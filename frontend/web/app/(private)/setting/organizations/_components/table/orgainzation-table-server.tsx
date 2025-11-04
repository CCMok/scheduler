import { Organization } from "@/external/prisma-generated";
import { redirect } from "next/navigation";
import { getOrganizationsService } from "@/libs/organization/services/get-organizations-service";
import { Role } from "@/libs/role/enums/role";
import OrganizationTable from "./organization-table";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getOrganizations = async (): Promise<Organization[]> => {
  const response = await getOrganizationsService()
  return handleGetResponse(response, redirect, [])
}

type Props = {
  role?: Role;
}

export default async function OrganizationTableServer({
  role,
}: Readonly<Props>) {
  const organizations = await getOrganizations();

  return (
    <OrganizationTable
      organizations={organizations}
      role={role}
    />
  )
}
