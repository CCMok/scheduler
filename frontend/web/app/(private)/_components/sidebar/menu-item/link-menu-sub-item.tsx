import ToggleSidebarMenuSubItem from '@/components/_general/sidebar/toggle-sidebar-menu-sub-item';
import CustomLink from '@/components/_general/link/custom-link';
import { SidebarMenuSubButton } from "@/external/shadcn/components/ui/sidebar";
import { checkCanAccess } from "@/libs/access/utils/route-access-utils";

type Props = {
  title: string;
  url: string;
}

export default async function LinkMenuSubItem({
  title,
  url,
}: Readonly<Props>) {
  const hasAccess = await checkCanAccess(url)
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