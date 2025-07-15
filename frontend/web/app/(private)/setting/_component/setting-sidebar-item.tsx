'use client'

import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/external/shadcn/components/ui/sidebar";
import { Path } from "@/libs/share/_general/enums/path";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: Path,
  title: string,
}

export default function SettingSidebarItem({
  href,
  title,
}: Readonly<Props>) {
  const pathname = usePathname()

  const isActive = pathname.startsWith(href)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={href}>{title}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}