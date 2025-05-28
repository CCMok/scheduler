import { Sidebar } from "@/external/shadcn/components/ui/sidebar"
import { ComponentProps } from "react"
import PrivateSidebarHeader from "./header/private-sidebar-header"
import PrivateSidebarFooter from "./footer/private-sidebar-footer"
import PrivateSidebarContent from "./content/private-sidebar-content"

export async function PrivateSidebar(props: Readonly<ComponentProps<typeof Sidebar>>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <PrivateSidebarHeader />
      <PrivateSidebarContent />
      <PrivateSidebarFooter />
    </Sidebar>
  )
}