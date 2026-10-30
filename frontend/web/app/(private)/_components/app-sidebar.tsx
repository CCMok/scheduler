import CustomLink from "@/components/_general/_custom/link/custom-link";
import Logo from "@/components/_general/logo/logo";
import ThemeMenuItems from "@/components/_general/theme/theme-menu-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/external/shadcn/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/external/shadcn/components/ui/sidebar";
import {
  Calendar,
  ChevronRight,
  Settings,
  UserPen,
  UsersRound,
} from "lucide-react";
import { ComponentProps } from "react";
import LogoutDropdownMenuItem from "./logout-dropdown-menu-item";
import UserDropdownMenuTrigger from "./user-dropdown-menu-trigger";
import { ROUTE } from "@/libs/_general/route/route-config";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/external/shadcn/components/ui/collapsible";

export default async function AppSidebar(
  props: Readonly<ComponentProps<typeof Sidebar>>,
) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex h-10 items-center px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <Logo
                size="sm"
                isRedirectHome={false}
                className="group-data-[collapsible=icon]:hidden"
              />
              <span className="font-display hidden text-base font-semibold text-primary group-data-[collapsible=icon]:inline">
                S
              </span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <UserDropdownMenuTrigger />
              <DropdownMenuContent
                className="w-(--radix-popper-anchor-width)"
                align="start"
              >
                <ThemeMenuItems />
                <DropdownMenuSeparator />
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
                    <SidebarMenuButton className="group">
                      <Settings />
                      <span>設定</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90" />
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
                          <CustomLink href={ROUTE.private.setting.team.base()}>
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
    </Sidebar>
  );
}
