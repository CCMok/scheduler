import { fetchData } from "@/libs/share/_general/utils/fetch";
import { Organization } from "@/external/prisma-generated";
import { redirect } from "next/navigation";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import OrganizationTable from "./_components/table/organization-table";
import OrganizationFilter from "./_components/filter/organization-filter";
import BreadcrumbHeaderLayout from '@/components/_general/layout/setting/breadcrumb-header-layout';
import CustomCard from '@/components/_general/card/custom-card';
import CreateOrganizationButton from "./_components/create/create-organization-button";
import { Role } from "@/libs/share/_general/enums/role";
import { getSession } from "@/libs/server/_general/managers/session-manager";

const getOrganizations = async (): Promise<Organization[]> => {
  return await fetchData(
    async () => await getOrganizationsService({
      orderBys: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
}

const getRole = async (): Promise<Role | undefined> => {
  const session = await getSession();
  if (!session) {
    return;
  }

  return session.roleEnum as Role;
}

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();
  
  const role = await getRole();
  const button = role === Role.SYSTEM_ADMIN ? <CreateOrganizationButton /> : undefined;

  return (
    <BreadcrumbHeaderLayout
      current="組織"
    >
      <CustomCard>
        <OrganizationFilter button={button} />
        <OrganizationTable
          organizations={organizations}
          role={role}
        />
      </CustomCard>
    </BreadcrumbHeaderLayout>
  )
}