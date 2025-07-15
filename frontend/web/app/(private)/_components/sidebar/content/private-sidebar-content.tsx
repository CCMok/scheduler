import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
} from "@/external/shadcn/components/ui/sidebar"
import { Path } from "@/libs/share/_general/enums/path"
import { Calendar, Home, Settings } from "lucide-react"
import Link from "next/link"
import PrivateSidebarMenuItem from "../menu-item/private-sidebar-menu-item"

const mainMenuItems = [
  {
    title: "主頁",
    url: Path.DASHBOARD,
    icon: Home,
  },
  {
    title: "值班表",
    url: Path.ROSTER,
    icon: Calendar,
  },
  {
    title: "設定",
    url: Path.SETTING_ORGANIZATION,
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