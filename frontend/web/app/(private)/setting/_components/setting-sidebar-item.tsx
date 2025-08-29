'use client'

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/external/shadcn/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { SettingMenuCategory, SettingMenuItem, checkIsSettingMenuCategory } from "./setting-menu-utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/external/shadcn/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import CustomLink from "@/components/link/custom-link";

type Props = {
  menu: SettingMenuCategory | SettingMenuItem,
}

export default function SettingSidebarItem({
  menu,
}: Readonly<Props>) {
  const pathname = usePathname()

  if (checkIsSettingMenuCategory(menu)) {
    const isActive = pathname.startsWith(menu.parentUrl)

    return (
      <Collapsible
        asChild
        defaultOpen={isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={menu.title}>
              <span>{menu.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {menu.items?.map(item => {
                const isActive = pathname.startsWith(item.url)

                return (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton asChild isActive={isActive}>
                      <CustomLink href={item.url}>{item.title}</CustomLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  const isActive = pathname.startsWith(menu.url)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <CustomLink href={menu.url}>{menu.title}</CustomLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}