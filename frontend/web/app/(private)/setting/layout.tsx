import { Separator } from "@/external/shadcn/components/ui/separator";
import {
  SidebarMenu,
} from "@/external/shadcn/components/ui/sidebar";
import { Path } from "@/libs/share/_general/enums/path";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import SettingSidebarItem from "./_component/setting-sidebar-item";

// TODO: organization admin / system user role
const menuItems = [
  {
    title: "組織",
    href: Path.SETTING_ORGANIZATION,
  },
];

export default function SettingLayout({
  children,
}: Readonly<ChildrenProps>) {

  return (
    <div className="flex h-full">
      <div className="w-3xs pr-4">
        <SidebarMenu>
          {menuItems.map(menuItem => (
            <SettingSidebarItem
              key={menuItem.href}
              href={menuItem.href}
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