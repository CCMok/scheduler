'use client'

import { SidebarMenuItem, useSidebar } from "@/external/shadcn/components/ui/sidebar"
import { ComponentProps } from "react"

export default function ToggleSidebarMenuItem(props: Readonly<ComponentProps<typeof SidebarMenuItem>>) {
  const { open, toggleSidebar, isMobile } = useSidebar()

  const onClick = () => {
    if (!open) return
    if (!isMobile) return

    toggleSidebar()
  }

  return (
    <SidebarMenuItem
      onClick={onClick}
      {...props}
    />
  )
}