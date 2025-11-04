import CustomLink from '@/components/_general/link/custom-link';
import ToggleSidebarMenuItem from '@/components/_general/sidebar/toggle-sidebar-menu-item';
import { SidebarMenuButton } from "@/external/shadcn/components/ui/sidebar";
import { checkCanAccess } from "@/libs/access/utils/route-access-utils";
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
  const hasAccess = await checkCanAccess(url)
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