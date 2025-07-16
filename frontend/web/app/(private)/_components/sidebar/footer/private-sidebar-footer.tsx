import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/external/shadcn/components/ui/sidebar"
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