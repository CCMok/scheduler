'use client'

import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/external/shadcn/components/ui/sidebar";
import { Path } from "@/libs/share/_general/enums/path";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  url: Path,
  title: string,
}

export default function SettingSidebarItem({
  url,
  title,
}: Readonly<Props>) {
  const pathname = usePathname()

  const isActive = pathname.startsWith(url)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={url}>{title}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}