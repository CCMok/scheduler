import { Separator } from "@/external/shadcn/components/ui/separator";
import {
  SidebarMenu,
} from "@/external/shadcn/components/ui/sidebar";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import SettingSidebarItem from "./_component/setting-sidebar-item";
import { getSession } from "@/libs/server/_general/managers/session-manager";
import { getMenuItems } from "./_component/setting-menu-utils";

export default async function SettingLayout({
  children,
}: Readonly<ChildrenProps>) {
  const sessionPayload = await getSession();
  const menuItems = sessionPayload ? getMenuItems(sessionPayload.roleEnum) : [];

  return (
    <div className="flex h-full">
      <div className="w-3xs pr-4">
        <SidebarMenu>
          {menuItems.map(menuItem => (
            <SettingSidebarItem
              key={menuItem.url}
              url={menuItem.url}
              title={menuItem.title}
            />
          ))}
        </SidebarMenu>
      </div>
      <Separator orientation="vertical" />
      <div className="w-full pl-4">{children}</div>
    </div>
  );
}