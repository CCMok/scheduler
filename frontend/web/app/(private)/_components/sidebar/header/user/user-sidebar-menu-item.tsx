import { DropdownMenu } from "@/external/shadcn/components/ui/dropdown-menu"
import { SidebarMenuItem } from "@/external/shadcn/components/ui/sidebar"
import LogoutDropdownMenuItem from "./logout-dropdown-menu-item"
import UserDropdownMenuTrigger from "./user-dropdown-menu-trigger"
import SidebarDropdownMenuContent from '@/components/_general/dropdown/sidebar-dropdown-menu-content'

export default async function UserSidebarMenuItem() {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <UserDropdownMenuTrigger />
        <SidebarDropdownMenuContent>
          <LogoutDropdownMenuItem />
        </SidebarDropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}