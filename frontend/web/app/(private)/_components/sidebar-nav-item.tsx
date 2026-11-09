"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/external/shadcn/components/ui/sidebar";
import { isNavActive } from "@/libs/_general/route/is-nav-active";
import { Route } from "next";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import SidebarNavLink from "./sidebar-nav-link";

type SidebarNavItemProps = Readonly<{
  href: Route;
  /** Path prefix for active match (no query). Defaults to href. */
  activeBase?: string;
  children: ReactNode;
}>;

export default function SidebarNavItem({
  href,
  activeBase,
  children,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const base = activeBase ?? href;
  const active = isNavActive(pathname, base);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active}>
        <SidebarNavLink href={href} aria-current={active ? "page" : undefined}>
          {children}
        </SidebarNavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
