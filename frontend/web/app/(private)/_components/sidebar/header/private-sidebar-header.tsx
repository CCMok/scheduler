import { SidebarHeader, SidebarMenu } from "@/external/shadcn/components/ui/sidebar"
import SidebarMenuItemUser from "./user/sidebar-menu-item-user"

export default function PrivateSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItemUser />
      </SidebarMenu>
    </SidebarHeader>
  )
}