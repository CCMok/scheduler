import DropdownMenuItemCustom from "@/components/dropdown/dropdown-menu-item-custom"
import { DropdownMenu, DropdownMenuTrigger } from "@/external/shadcn/components/ui/dropdown-menu"
import { Separator } from "@/external/shadcn/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/external/shadcn/components/ui/sidebar"
import { Path } from "@/libs/share/_general/enums/path"
import { Calendar, ChevronDown, Home, Moon, Settings, Sun } from "lucide-react"
import Link from "next/link"
import { ComponentProps } from "react"
import PrivateSidebarHeader from "./header/private-sidebar-header"
import DropdownMenuContentSidebar from "@/components/dropdown/dropdown-menu-content-sidebar"

const mainMenuItems = [
  {
    title: "主頁",
    url: Path.DASHBOARD,
    icon: Home,
  },
  {
    title: "值勤表",
    url: Path.ROSTER,
    icon: Calendar,
  },
  {
    title: "設定",
    url: Path.SETTING,
    icon: Settings,
  },
]

type Props = ComponentProps<typeof Sidebar>

// TODO mobile click to close sidebar

export async function PrivateSidebar(props: Readonly<Props>) {
  return (
    <Sidebar {...props}>
      <PrivateSidebarHeader />
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* TODO theme implement */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Sun />
                  <span>Light</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContentSidebar>
                <DropdownMenuItemCustom asChild>
                  <Link href="/logout">
                    <Moon />
                    <span>Dark</span>
                  </Link>
                </DropdownMenuItemCustom>
                <DropdownMenuItemCustom asChild>
                  <Link href="/logout">
                    <Moon />
                    <span>System</span>
                  </Link>
                </DropdownMenuItemCustom>
              </DropdownMenuContentSidebar>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}