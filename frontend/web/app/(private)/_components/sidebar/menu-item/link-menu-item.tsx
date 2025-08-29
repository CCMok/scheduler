import CustomLink from "@/components/link/custom-link";
import ToggleSidebarMenuItem from "@/components/sidebar/toggle-sidebar-menu-item";
import { SidebarMenuButton } from "@/external/shadcn/components/ui/sidebar";
import { ReactNode } from "react";

type Props = {
  title: string;
  url: string;
  icon?: ReactNode;
}

export default function LinkMenuItem({
  title,
  url,
  icon,
}: Readonly<Props>) {
  return (
    <ToggleSidebarMenuItem>
      <SidebarMenuButton
        asChild
      >
        <CustomLink href={url}>
          {icon}
          <span>{title}</span>
        </CustomLink>
      </SidebarMenuButton>
    </ToggleSidebarMenuItem>
  )
}