import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/external/shadcn/components/ui/sidebar"
import { ChildrenProps } from "@/libs/share/_general/props/children-props"
import { PrivateSidebar } from "./_components/sidebar/private-sidebar"

export default function PrivateLayout({
  children,
}: Readonly<ChildrenProps>) {
  return (
    <SidebarProvider>
      <PrivateSidebar variant='inset' />
      <SidebarInset>
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}