import ToggleSidebarMenuSubItem from "@/components/sidebar/toggle-sidebar-menu-sub-item";
import CustomLink from "@/components/link/custom-link";
import { SidebarMenuSubButton } from "@/external/shadcn/components/ui/sidebar";
import { isAccessable } from "@/libs/server/access/services/route-access-service";

type Props = {
  title: string;
  url: string;
}

export default async function LinkMenuSubItem({
  title,
  url,
}: Readonly<Props>) {
  const hasAccess = await isAccessable(url)
  if (!hasAccess) return <></>

  return (
    <ToggleSidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
      >
        <CustomLink href={url}>
          <span>{title}</span>
        </CustomLink>
      </SidebarMenuSubButton>
    </ToggleSidebarMenuSubItem>
  )
}