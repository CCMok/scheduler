import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/external/shadcn/components/ui/sidebar";
import { MenuItem } from "../utils/menu-item";
import { ReactNode } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/external/shadcn/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import LinkMenuSubItem from "./link-menu-sub-item";

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
            {items.map(item => (
              <LinkMenuSubItem
                key={item.title}
                title={item.title}
                url={item.url}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}