import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/external/shadcn/components/ui/sidebar"
import { ThemeToggle } from '@/components/_general/button/theme-toggle'

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