import { Separator } from "@/external/shadcn/components/ui/separator";
import {
  SidebarMenu,
} from "@/external/shadcn/components/ui/sidebar";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import SettingSidebarItem from "./_component/setting-sidebar-item";
import { getSession } from "@/libs/server/_general/managers/session-manager";
import { getMenus } from "./_component/setting-menu-utils";

export default async function SettingLayout({
  children,
}: Readonly<ChildrenProps>) {
  const sessionPayload = await getSession();
  const menus = sessionPayload ? getMenus(sessionPayload.roleEnum) : [];

  return (
    <div className="flex h-full">
      <div className="w-3xs pr-4">
        <SidebarMenu>
          {menus.map(menu => (
            <SettingSidebarItem
              key={menu.title}
              menu={menu}
            />
          ))}
        </SidebarMenu>
      </div>
      <Separator orientation="vertical" />
      <div className="w-full pl-4">{children}</div>
    </div>
  );
}