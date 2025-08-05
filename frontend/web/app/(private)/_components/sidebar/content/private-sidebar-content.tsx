import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
} from "@/external/shadcn/components/ui/sidebar"
import { Calendar, Home, Settings } from "lucide-react"
import Link from "next/link"
import PrivateSidebarMenuItem from "../menu-item/private-sidebar-menu-item"
import { PATH } from "@/libs/share/_general/utils/path"

const mainMenuItems = [
  {
    title: "主頁",
    url: PATH.dashboard,
    icon: Home,
  },
  {
    title: "值班表",
    url: PATH.roster.base,
    icon: Calendar,
  },
  {
    title: "設定",
    url: PATH.setting.user,
    icon: Settings,
  },
]

export default function PrivateSidebarContent() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainMenuItems.map(item => (
              <PrivateSidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </PrivateSidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}