import CustomLink from "@/components/_general/link/custom-link";
import ThemeToggle from "@/components/_general/theme/theme-toggle";
import { DropdownMenu, DropdownMenuContent } from "@/external/shadcn/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/external/shadcn/components/ui/sidebar";
import { Path } from "@/libs/_general/path/path";
import { Calendar } from "lucide-react";
import { ComponentProps } from "react";
import LogoutDropdownMenuItem from "./logout-dropdown-menu-item";
import UserDropdownMenuTrigger from "./user-dropdown-menu-trigger";

export default async function AppSidebar(props: Readonly<ComponentProps<typeof Sidebar>>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <UserDropdownMenuTrigger />
              <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
                <LogoutDropdownMenuItem />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>值班表</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <CustomLink href={Path.ROSTER + Path.NEW}>
                      <Calendar />
                      <span>編製值班表</span>
                    </CustomLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}