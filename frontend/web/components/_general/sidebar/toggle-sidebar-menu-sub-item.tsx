'use client'

import { SidebarMenuSubItem, useSidebar } from "@/external/shadcn/components/ui/sidebar"
import { ComponentProps } from "react"

export default function ToggleSidebarMenuSubItem(props: Readonly<ComponentProps<typeof SidebarMenuSubItem>>) {
  const { open, toggleSidebar, isMobile } = useSidebar()

  const onClick = () => {
    if (!open) return
    if (!isMobile) return

    toggleSidebar()
  }

  return (
    <SidebarMenuSubItem
      onClick={onClick}
      {...props}
    />
  )
}