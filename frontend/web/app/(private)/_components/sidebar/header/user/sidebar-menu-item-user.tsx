import { DropdownMenu } from "@/external/shadcn/components/ui/dropdown-menu"
import { SidebarMenuItem } from "@/external/shadcn/components/ui/sidebar"
import DropdownMenuItemLogout from "./dropdown-menu-item-logout"
import DropdownMenuTriggerUser from "./dropdown-menu-trigger-user"
import DropdownMenuContentSidebar from "@/components/dropdown/dropdown-menu-content-sidebar"

export default async function SidebarMenuItemUser() {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTriggerUser />
        <DropdownMenuContentSidebar>
          <DropdownMenuItemLogout />
        </DropdownMenuContentSidebar>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}