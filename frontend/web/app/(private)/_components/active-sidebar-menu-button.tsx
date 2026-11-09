"use client";

import { SidebarMenuButton } from "@/external/shadcn/components/ui/sidebar";
import { isNavActive } from "@/libs/_general/route/is-nav-active";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

type ActiveSidebarMenuButtonProps = Readonly<
  Omit<ComponentProps<typeof SidebarMenuButton>, "isActive"> & {
    activeBase: string;
  }
>;

export default function ActiveSidebarMenuButton({
  activeBase,
  ...props
}: ActiveSidebarMenuButtonProps) {
  const pathname = usePathname();
  return (
    <SidebarMenuButton
      {...props}
      isActive={isNavActive(pathname, activeBase)}
    />
  );
}
