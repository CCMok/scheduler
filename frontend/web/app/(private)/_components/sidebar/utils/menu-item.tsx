import { PATH } from "@/libs/share/_general/utils/path";
import { Calendar, Settings } from "lucide-react";
import { ReactNode } from "react";

export type Icon = {
  icon: ReactNode;
}

export type MenuItem = {
  title: string;
  url: string;
}

export type IconParentItem = Icon & {
  title: string;
  children: MenuItem[];
}

export type IconMenuItem = MenuItem & Icon

export type MainItem = IconMenuItem | IconParentItem

export const MENU_ITEMS: MainItem[] = [
  {
    title: "值班表",
    icon: <Calendar />,
    children: [
      {
        title: '編排',
        url: PATH.roster.new,
      },
      {
        title: '紀錄',
        url: PATH.roster.histories.base,
      },
    ],
  },
  {
    title: "設定",
    icon: <Settings />,
    children: [
      {
        title: '一般',
        url: PATH.setting.general,
      },
      {
        title: '機構',
        url: PATH.setting.organizations.base,
      },
      {
        title: '部門',
        url: PATH.setting.departments,
      },
      {
        title: '用戶',
        url: PATH.setting.users.base,
      },
    ],
  },
]