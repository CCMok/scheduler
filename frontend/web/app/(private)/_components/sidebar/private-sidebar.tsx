import { Separator } from "@/external/shadcn/components/ui/separator"
import { Sidebar } from "@/external/shadcn/components/ui/sidebar"
import { ComponentProps } from "react"
import PrivateSidebarHeader from "./header/private-sidebar-header"
import PrivateSidebarFooter from "./footer/private-sidebar-footer"
import PrivateSidebarContent from "./content/private-sidebar-content"

type Props = ComponentProps<typeof Sidebar>

// TODO mobile click to close sidebar

export async function PrivateSidebar(props: Readonly<Props>) {
  return (
    <Sidebar {...props}>
      <PrivateSidebarHeader />
      <Separator />
      <PrivateSidebarContent />
      <PrivateSidebarFooter />
    </Sidebar>
  )
}