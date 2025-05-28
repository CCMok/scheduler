import { SidebarHeader, SidebarMenu } from "@/external/shadcn/components/ui/sidebar"
import UserSidebarMenuItem from "./user/user-sidebar-menu-item"

export default function PrivateSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <UserSidebarMenuItem />
      </SidebarMenu>
    </SidebarHeader>
  )
}