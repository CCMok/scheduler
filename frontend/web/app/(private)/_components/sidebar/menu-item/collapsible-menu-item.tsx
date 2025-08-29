import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton } from "@/external/shadcn/components/ui/sidebar";
import { MenuItem } from "../utils/menu-item";
import { ReactNode } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/external/shadcn/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import ToggleSidebarMenuSubItem from "@/components/sidebar/toggle-sidebar-menu-sub-item";
import CustomLink from "@/components/link/custom-link";

type Props = {
  title: string;
  icon: ReactNode;
  items: MenuItem[];
}

export default function CollapsibleMenuItem({
  title,
  icon,
  items,
}: Readonly<Props>) {
  return (
    <Collapsible
      asChild
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={title}>
            {icon}
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map(item => {
              return (
                <ToggleSidebarMenuSubItem key={item.title}>
                  <SidebarMenuSubButton
                    asChild
                  >
                    <CustomLink href={item.url}>
                      <span>{item.title}</span>
                    </CustomLink>
                  </SidebarMenuSubButton>
                </ToggleSidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}