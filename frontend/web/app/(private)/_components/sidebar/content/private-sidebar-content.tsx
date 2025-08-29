import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/external/shadcn/components/ui/sidebar"
import PrivateSidebarMenuItem from "../menu-item/private-sidebar-menu-item"
import { MENU_ITEMS } from "../utils/menu-item"

export default function PrivateSidebarContent() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {MENU_ITEMS.map(item => (
              <PrivateSidebarMenuItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}