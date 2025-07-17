import { Path } from "@/libs/share/_general/enums/path";
import { Role } from "@/libs/share/_general/enums/role";

const userMenuItems: SettingMenuItem = {
  title: "用戶",
  url: Path.SETTING_USER,
}

const organizationMenuItems: SettingMenuItem = {
  title: "組織",
  url: Path.SETTING_ORGANIZATION,
}

export const ACCESS_MENU_ITEM_MAP = new Map<Role, SettingMenuItem[]>([
  [Role.SYSTEM_ADMIN, [
    userMenuItems,
    organizationMenuItems,
  ]],
  [Role.ORGANIZATION_ADMIN, [
    userMenuItems,
    organizationMenuItems,
  ]],
])

export type SettingMenuItem = {
  title: string,
  url: Path,
}

export const getMenuItems = (role: Role): SettingMenuItem[] =>
  ACCESS_MENU_ITEM_MAP.get(role) ?? []