import { DropdownMenu, DropdownMenuContent } from "@/external/shadcn/components/ui/dropdown-menu"
import { SidebarMenuItem } from "@/external/shadcn/components/ui/sidebar"
import DropdownMenuItemLogout from "./dropdown-menu-item-logout"
import DropdownMenuTriggerUser from "./dropdown-menu-trigger-user"
import DropdownMenuItemUserSetting from "./dropdown-menu-item-user-setting"

export default async function SidebarMenuItemUser() {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTriggerUser />
        <DropdownMenuContent className='w-(--radix-dropdown-menu-trigger-width)'>
          <DropdownMenuItemLogout />
          <DropdownMenuItemUserSetting />
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}