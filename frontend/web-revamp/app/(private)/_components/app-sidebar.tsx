import CustomLink from "@/components/_general/_custom/link/custom-link";
import ThemeToggle from "@/components/_general/theme/theme-toggle";
import { DropdownMenu, DropdownMenuContent } from "@/external/shadcn/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/external/shadcn/components/ui/sidebar";
import { Calendar, ChevronRight, Settings, UserPen, UsersRound } from "lucide-react";
import { ComponentProps } from "react";
import LogoutDropdownMenuItem from "./logout-dropdown-menu-item";
import UserDropdownMenuTrigger from "./user-dropdown-menu-trigger";
import { ROUTE } from "@/libs/_general/route/route-config";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/external/shadcn/components/ui/collapsible";

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
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <CustomLink href={ROUTE.private.roster.base()}>
                    <Calendar />
                    <span>值班表</span>
                  </CustomLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className='group'>
                      <Settings />
                      <span>設定</span>
                      <ChevronRight className='ml-auto group-data-[state=open]:rotate-90 transition-transform duration-200' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <CustomLink href={ROUTE.private.setting.user}>
                            <UserPen />
                            <span>用戶</span>
                          </CustomLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <CustomLink href={ROUTE.private.setting.team()}>
                            <UsersRound />
                            <span>團隊</span>
                          </CustomLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
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