import { fetchData } from "@/libs/share/_general/utils/fetch";
import { Organization } from "@/external/prisma-generated";
import { redirect } from "next/navigation";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { Role } from "@/libs/share/_general/enums/role";
import OrganizationTable from "./organization-table";

const getOrganizations = async (): Promise<Organization[]> => {
  return await fetchData(
    async () => await getOrganizationsService({
      orderBys: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
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
