import CustomCard from '@/components/_general/card/custom-card';
import { Suspense } from "react";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import UserFilter from './_components/filter/user-filter';
import { UserExcludePasswordWithRole } from '@/libs/user/models/user-dao';
import { getUsersWithRoleService } from '@/libs/user/services/get-users-with-role-service';
import { redirect } from 'next/navigation';
import { handleGetResponse } from '@/libs/_general/utils/response-utils';
import UserTable from './_components/table/user-table';

const getUsers = async (): Promise<UserExcludePasswordWithRole[]> => {
  const response = await getUsersWithRoleService()
  return handleGetResponse(response, redirect, [])
}

export default function UsersPage() {
  const usersPromise = getUsers();

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
          <UserTable
            usersPromise={usersPromise}
          />
        </Suspense>
      </CustomCard>
    </SidebarInsetLayout>
  )
}