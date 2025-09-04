import { PATH } from "@/libs/share/_general/utils/path";
import { Calendar, Home, Settings } from "lucide-react";
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
    title: "主頁",
    icon: <Home />,
    url: PATH.dashboard,
  },
  {
    title: "值班表",
    icon: <Calendar />,
    url: PATH.roster,
  },
  {
    title: "設定",
    icon: <Settings />,
    children: [
      {
        title: '用戶',
        url: PATH.setting.user,
      },
      {
        title: '組織',
        url: PATH.setting.organizationsOld,
      },
      {
        title: '部門',
        url: PATH.setting.departments,
      },
      {
        title: '職位',
        url: PATH.setting.posts,
      },
      {
        title: '人員',
        url: PATH.setting.workers,
      },
    ],
  },
]