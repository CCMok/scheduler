import CustomCard from "@/components/_general/card/custom-card";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import DepartmentFilter from "./_components/filter/department-filter";
import DepartmentTable from "./_components/table/department-table";
import { DepartmentWithOrganizationChildrenCount } from "@/libs/department/models/department-dao";
import { getDepartmentsWithOrganizationChildCountService } from "@/libs/department/services/get-departments-with-organization-child-count-service";
import { redirect } from "next/navigation";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import CreateDepartmentButton from "./_components/create/create-department-button";
import { getOrganizationsService } from "@/libs/organization/services/get-organizations-service";
import { Organization } from "@/external/prisma-generated";
import ButtonSkeleton from "@/components/_general/skeleton/button-skeleton";

const getOrganizations = async (): Promise<Organization[]> => {
  const response = await getOrganizationsService()
  return handleGetResponse(response, redirect, [])
}

const getDepartments = async (): Promise<DepartmentWithOrganizationChildrenCount[]> => {
  const response = await getDepartmentsWithOrganizationChildCountService()
  return handleGetResponse(response, redirect, [])
}

export default function DepartmentSettingPage() {
  const organizationsPromise = getOrganizations();
  const departmentsPromise = getDepartments();

  return (
    <SidebarInsetLayout
      breadcrumbItems={[
        {
          key: 'setting',
          label: '設定',
        },
        {
          key: 'departments',
          label: '部門',
        },
      ]}
    >
      <CustomCard>
        <Suspense>
          <DepartmentFilter button={(
            <Suspense fallback={<ButtonSkeleton />}>
              <CreateDepartmentButton
                organizationsPromise={organizationsPromise}
              />
            </Suspense>
          )} />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <DepartmentTable
            departmentsPromise={departmentsPromise}
          />
        </Suspense>
      </CustomCard>
    </SidebarInsetLayout>
  )
}