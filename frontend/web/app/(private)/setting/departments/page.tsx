import CustomCard from "@/components/_general/card/custom-card";
import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import DepartmentTableServer from "./_components/table/department-table-server";
import DepartmentFilter from "./_components/filter/department-filter";
import CreateDepartmentButtonServer from "./_components/create/create-department-buttont-server";

export default function DepartmentSettingPage() {
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
          <DepartmentFilter button={<CreateDepartmentButtonServer />} />
        </Suspense>
        <Suspense fallback={<TableSkeleton />}>
          <DepartmentTableServer />
        </Suspense>
      </CustomCard>
    </SidebarInsetLayout>
  )
}