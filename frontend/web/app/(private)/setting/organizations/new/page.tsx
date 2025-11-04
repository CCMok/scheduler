import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import { PATH } from "@/libs/_general/enums/path";
import CreateOrganizationForm from "./_components/form/create-organization-form";

export default function OrganizationsNewPage() {
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
          href: PATH.setting.organizations.base,
        },
      ]}
    >
      <CreateOrganizationForm />
    </SidebarInsetLayout>
  )
}