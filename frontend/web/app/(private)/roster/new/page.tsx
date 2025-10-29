import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";
import CreateRosterPageContent from "./_components/content/create-roster-page-content";

export default function CreateRosterPage() {
  return (
    <SidebarInsetLayout
      breadcrumbItems={[
        {
          key: 'roster',
          label: '值班表',
        },
        {
          key: 'new',
          label: '編排',
        },
      ]}
    >
      <CreateRosterPageContent />
    </SidebarInsetLayout>
  )
}