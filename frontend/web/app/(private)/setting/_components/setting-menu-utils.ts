import { Role } from "@/libs/share/_general/enums/role";
import { PATH } from "@/libs/share/_general/utils/path";
import { z } from "zod";

export const settingMenuItemSchema = z.object({
  title: z.string(),
  url: z.string(),
})

export type SettingMenuItem = z.infer<typeof settingMenuItemSchema>

export const settingMenuCategorySchema = z.object({
  title: z.string(),
  parentUrl: z.string(),
  items: settingMenuItemSchema.array(),
})

export type SettingMenuCategory = z.infer<typeof settingMenuCategorySchema>

export const checkIsSettingMenuCategory = (item: SettingMenuCategory | SettingMenuItem): item is SettingMenuCategory =>
  settingMenuCategorySchema.safeParse(item).success

const userMenuItems: SettingMenuItem = {
  title: "用戶",
  url: PATH.setting.user,
}

const organizationMenuItems: SettingMenuItem = {
  title: "組織",
  url: PATH.setting.organization,
}

const departmentMenuItems: SettingMenuCategory = {
  title: "部門",
  parentUrl: PATH.setting.department.base,
  items: [
    {
      title: "職位",
      url: PATH.setting.department.post,
    },
    {
      title: "人員",
      url: PATH.setting.department.worker,
    }
  ]
}

export const DEPARTMENT_SETTING_DEFAULT_PATH = PATH.setting.department.post

export const ACCESS_MENU_ITEM_MAP = new Map<Role, (SettingMenuCategory | SettingMenuItem)[]>([
  [Role.SYSTEM_ADMIN, [
    userMenuItems,
    organizationMenuItems,
    departmentMenuItems,
  ]],
  [Role.ORGANIZATION_ADMIN, [
    userMenuItems,
    organizationMenuItems,
    departmentMenuItems,
  ]],
])

export const getMenus = (role: Role): (SettingMenuItem | SettingMenuCategory)[] =>
  ACCESS_MENU_ITEM_MAP.get(role) ?? []