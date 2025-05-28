import { SidebarInset, SidebarProvider } from "@/external/shadcn/components/ui/sidebar"
import { ChildrenProps } from "@/libs/share/_general/props/children-props"
import { PrivateSidebar } from "./_components/sidebar/private-sidebar"
import PrivateHeader from "./_components/header/private-header"
import { Separator } from "@/external/shadcn/components/ui/separator"

export default function PrivateLayout({
  children,
}: Readonly<ChildrenProps>) {
  return (
    <SidebarProvider>
      <PrivateSidebar variant='inset' />
      <SidebarInset>
        <PrivateHeader />
        <Separator />
        <main className='p-4 h-full'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}