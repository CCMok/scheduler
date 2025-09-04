import ManageTableSection from '@/components/_general/table/manage-table-section';
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { Organization } from "@/external/prisma-generated";
import { redirect } from "next/navigation";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import OrganizationTable from "./_components/organization-table";
import OrganizationFilter from "./_components/organization-filter";
import BreadcrumbHeaderLayout from '@/components/_general/layout/setting/breadcrumb-header-layout';

const getOrganizations = async (): Promise<Organization[]> => {
  return await fetchData(
    async () => await getOrganizationsService({
      orderBy: [{ field: 'name' }],
    }),
    path => redirect(path),
    [],
  )
}

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <BreadcrumbHeaderLayout
      current="組織"
      isBack={false}
    >
      <ManageTableSection
        filter={<OrganizationFilter />}
        table={<OrganizationTable organizations={organizations} />}
      />
    </BreadcrumbHeaderLayout>
  )
}