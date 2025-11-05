import OrganizationFilter from "./_components/filter/organization-filter";
import CustomCard from '@/components/_general/card/custom-card';
import CreateOrganizationButton from "./_components/create/create-organization-button";
import { Role } from "@/libs/role/enums/role";
import { getSession } from "@/libs/access/managers/session-manager";
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import OrganizationTable from "./_components/table/organization-table";
import { Organization } from "@/external/prisma-generated";
import { getOrganizationsService } from "@/libs/organization/services/get-organizations-service";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { redirect } from "next/navigation";

const getRole = async (): Promise<Role | undefined> => {
  const session = await getSession();
  return session?.roleEnum;
}

const getOrganizations = async (): Promise<Organization[]> => {
  const response = await getOrganizationsService()
  return handleGetResponse(response, redirect, [])
}

export default function OrganizationsPage() {
  const rolePromise = getRole();
  const organizationsPromise = getOrganizations();

  return (
    <SidebarInsetLayout
      breadcrumbItems={[
        {
          key: 'setting',
          label: '設定',
        },
        {
          key: 'organizations',
          label: '機構',
        },
      ]}
    >
      <CustomCard>
        <Suspense>
          <OrganizationFilter button={<CreateOrganizationButton />} />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <OrganizationTable
            rolePromise={rolePromise}
            organizationsPromise={organizationsPromise}
          />
        </Suspense>
      </CustomCard>
    </SidebarInsetLayout>
  )
}