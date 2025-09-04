import CustomLink from '@/components/_general/link/custom-link';
import ToggleSidebarMenuItem from '@/components/_general/sidebar/toggle-sidebar-menu-item';
import { SidebarMenuButton } from "@/external/shadcn/components/ui/sidebar";
import { isAccessable } from "@/libs/server/access/services/route-access-service";
import { ReactNode } from "react";

type Props = {
  title: string;
  url: string;
  icon?: ReactNode;
}

export default async function LinkMenuItem({
  title,
  url,
  icon,
}: Readonly<Props>) {
  const hasAccess = await isAccessable(url)
  if (!hasAccess) return <></>

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