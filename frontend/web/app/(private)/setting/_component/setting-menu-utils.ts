import { Path } from "@/libs/share/_general/enums/path";
import { Role } from "@/libs/share/_general/enums/role";

const organizationMenuItems: SettingMenuItem = {
  title: "組織",
  href: Path.SETTING_ORGANIZATION,
}

export const ACCESS_MENU_ITEM_MAP = new Map<Role, SettingMenuItem[]>([
  [Role.SYSTEM_ADMIN, [
    organizationMenuItems,
  ]],
  [Role.ORGANIZATION_ADMIN, [
    organizationMenuItems,
  ]],
])

export type SettingMenuItem = {
  title: string,
  href: Path,
}

export const getMenuItems = (role: Role): SettingMenuItem[] =>
  ACCESS_MENU_ITEM_MAP.get(role) ?? []