import DropdownMenuItemCustom from "@/components/dropdown/dropdown-menu-item-custom"
import { DropdownMenu, DropdownMenuTrigger } from "@/external/shadcn/components/ui/dropdown-menu"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/external/shadcn/components/ui/sidebar"
import { ChevronDown, Moon, Sun } from "lucide-react"
import Link from "next/link"
import DropdownMenuContentSidebar from "@/components/dropdown/dropdown-menu-content-sidebar"
import { ThemeToggle } from "@/components/button/theme-toggle"

export default function PrivateSidebarFooter() {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <ThemeToggle />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}