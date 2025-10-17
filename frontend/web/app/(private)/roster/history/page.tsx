import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout";

export default function RosterHistoryPage() {
  return (
    <SidebarInsetLayout breadcrumbItems={[
      {
        key: 'roster',
        label: '值班表',
      },
      {
        key: 'history',
        label: '紀錄',
      },
    ]}>
      <div>
        <h1>Roster History</h1>
      </div>
    </SidebarInsetLayout>
  )
}