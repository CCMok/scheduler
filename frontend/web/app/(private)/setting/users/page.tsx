import CustomCard from '@/components/_general/card/custom-card';
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import UserFilter from './_components/filter/user-filter';
import UserTableServer from './_components/table/user-table-server';

export default async function UsersPage() {
  return (
    <SidebarInsetLayout
      breadcrumbItems={[
        {
          key: 'setting',
          label: '設定',
        },
        {
          key: 'users',
          label: '用戶',
        },
      ]}
    >
      <CustomCard>
        <Suspense>
          <UserFilter />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <UserTableServer />
        </Suspense>
      </CustomCard>
    </SidebarInsetLayout>
  )
}