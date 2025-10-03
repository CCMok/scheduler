import OrganizationFilter from "./_components/filter/organization-filter";
import CustomCard from '@/components/_general/card/custom-card';
import CreateOrganizationButton from "./_components/create/create-organization-button";
import { Role } from "@/libs/share/_general/enums/role";
import { getSession } from "@/libs/server/_general/managers/session-manager";
import OrganizationTableServer from "./_components/table/orgainzation-table-server";
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";

const getRole = async (): Promise<Role | undefined> => {
  const session = await getSession();
  if (!session) {
    return;
  }

  return session.roleEnum as Role;
}

export default async function OrganizationsPage() {
  const role = await getRole();
  const button = role === Role.SYSTEM_ADMIN ? <CreateOrganizationButton /> : undefined;

  return (
    <SidebarInsetLayout
      breadcrumbItems={[
        {
          key: 'setting',
          label: '設定',
        },
        {
          key: 'organizations',
          label: '組織',
        },
      ]}
    >
      <CustomCard>
        <OrganizationFilter button={button} />
        <Suspense fallback={<TableSkeleton />}>
          <OrganizationTableServer role={role} />
        </Suspense>
      </CustomCard>
    </SidebarInsetLayout>
  )
}