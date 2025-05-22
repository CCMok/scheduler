import { SidebarProvider, SidebarTrigger } from "@/external/shadcn/components/ui/sidebar"
import { ChildrenProps } from "@/libs/share/_general/props/children-props"
import { PrivateSidebar } from "./_components/private-sidebar"

export default function PrivateLayout({
  children,
}: Readonly<ChildrenProps>) {
  return (
    <SidebarProvider>
      <PrivateSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}